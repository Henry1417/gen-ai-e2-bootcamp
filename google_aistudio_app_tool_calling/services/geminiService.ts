import { GoogleGenAI, Type, FunctionDeclaration, Chat } from "@google/genai";
import { ReportEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- 1. Tool Definition ---
const consultarReportesTool: FunctionDeclaration = {
  name: "consultar_reportes",
  parameters: {
    type: Type.OBJECT,
    description: "Busca y filtra el listado de reportes regulatorios actuales. Útil para saber qué reportes tienen errores, cuáles faltan, o el estado de un departamento.",
    properties: {
      departamento: {
        type: Type.STRING,
        description: "Filtra por departamento (ej: 'Riesgos', 'Cumplimiento', 'Regulatorio'). Opcional.",
      },
      estatus: {
        type: Type.STRING,
        description: "Filtra por estado del reporte. Valores: 'PENDING', 'SUCCESS', 'ERROR_FORMAT', 'READY'. Opcional.",
      },
    },
  },
};

// --- 2. Tool Execution Logic ---
const executeTool = (name: string, args: any, currentReports: ReportEntry[]) => {
  if (name === "consultar_reportes") {
    console.log("🛠️ Tool Execution:", name, args);
    
    const { departamento, estatus } = args;

    const filtered = currentReports.filter((r) => {
      const matchDept = departamento 
        ? r.department.toLowerCase().includes(departamento.toLowerCase())
        : true;
      const matchStatus = estatus 
        ? r.status === estatus 
        : true;
      return matchDept && matchStatus;
    });

    if (filtered.length === 0) {
      return { 
        result: "No se encontraron reportes con esos criterios.", 
        count: 0 
      };
    }

    // Return a structured object
    return {
      count: filtered.length,
      reportes: filtered.map(r => ({
        nombre: r.reportName,
        departamento: r.department,
        estatus: r.status,
        fecha: r.date,
        mensaje_error: r.history.length > 0 && r.status.includes('ERROR') 
          ? r.history[r.history.length -1].message 
          : 'N/A'
      }))
    };
  }
  return { error: `Herramienta desconocida: ${name}` };
};

// --- 3. Chat Session Management ---

let chatSession: Chat | null = null;

export const sendMessageToAI = async (
  userMessage: string, 
  currentReports: ReportEntry[]
): Promise<string> => {
  
  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "Eres el Asistente de Cumplimiento de RegulaBank. Tu trabajo es ayudar a los usuarios a consultar el estado de sus reportes regulatorios. Siempre responde de manera concisa y profesional.",
          tools: [{ functionDeclarations: [consultarReportesTool] }],
        }
      });
    }

    let response = await chatSession.sendMessage({ message: userMessage });

    // Handle Tool Calls Loop
    while (response.functionCalls && response.functionCalls.length > 0) {
      const toolParts = [];
      for (const call of response.functionCalls) {
        const result = executeTool(call.name, call.args, currentReports);
        toolParts.push({
          functionResponse: {
            name: call.name,
            response: { result: result },
            id: call.id
          }
        });
      }
      
      // Send tool outputs back to the model
      response = await chatSession.sendMessage({ message: toolParts });
    }

    return response.text || "No entendí tu solicitud.";

  } catch (error) {
    console.error("AI Service Error:", error);
    // Reset session on error to avoid stuck state
    chatSession = null;
    return "Lo siento, hubo un error de conexión con el servicio de IA.";
  }
};