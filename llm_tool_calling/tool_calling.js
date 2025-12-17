import { GoogleGenAI, Type } from "@google/genai";

/**
 * LLM Tool Calling - Retail Inventory System (JavaScript Example)
 * Vertical: Retail
 * 
 * Architecture:
 * - InventoryService: Handles business logic (Mock DB).
 * - GoogleGenAI: Handles orchestration with Gemini.
 */

// --- 1. MOCK DATABASE ---
const INVENTORY_MOCK = {
    "laptop-001": { "name": "Laptop Dell XPS 15", "price": 1299.99, "stock": 15, "location": "A-3" },
    "phone-002": { "name": "iPhone 15 Pro", "price": 999.99, "stock": 8, "location": "A-1" },
    "chair-003": { "name": "Silla OfficeMax", "price": 249.99, "stock": 25, "location": "B-5" },
};

// --- 2. SERVICE LAYER ---
const InventoryService = {
    getProductDetails: (productId) => {
        console.log(`   ⚙️ [SERVICE] Consultando DB para ID: ${productId}...`);
        const product = INVENTORY_MOCK[productId];

        return {
            success: !!product,
            product_id: productId,
            data: product || "Producto no encontrado",
            metadata: { available_ids: Object.keys(INVENTORY_MOCK) }
        };
    }
};

// --- 3. SDK SETUP ---
// Note: Ensure process.env.API_KEY is set
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY' });

const getProductDetailsTool = {
    name: 'get_product_details',
    parameters: {
        type: Type.OBJECT,
        description: 'Obtiene stock, precio y ubicación de un producto por su ID.',
        properties: {
            product_id: {
                type: Type.STRING,
                description: 'ID del producto (ej: laptop-001, phone-002)'
            }
        },
        required: ['product_id']
    }
};

// --- 4. EXECUTION ---
async function main() {
    const model = "gemini-2.5-flash";
    const tools = [{ functionDeclarations: [getProductDetailsTool] }];

    // Conversation History
    const history = [];

    const userQuery = "Necesito verificar el stock de la laptop-001";
    console.log(`\n💬 USER: ${userQuery}`);

    history.push({ role: 'user', parts: [{ text: userQuery }] });

    // 1st Turn: Model decides to call tool
    const result1 = await ai.models.generateContent({
        model,
        contents: history,
        config: { tools }
    });

    const response1 = result1.candidates?.[0]?.content;
    history.push(response1);

    const toolCalls = response1?.parts?.filter(p => p.functionCall);

    if (toolCalls && toolCalls.length > 0) {
        const functionResponses = [];

        for (const part of toolCalls) {
            const call = part.functionCall;
            console.log(`⚡ [LLM DECISION] Ejecutar: ${call.name} con args`, call.args);

            if (call.name === 'get_product_details') {
                const apiResult = InventoryService.getProductDetails(call.args.product_id);

                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: { result: apiResult }
                    }
                });
            }
        }

        // Add tool results to history
        history.push({ role: 'user', parts: functionResponses });

        // 2nd Turn: Model generates final answer
        const result2 = await ai.models.generateContent({
            model,
            contents: history,
            config: { tools }
        });

        const text = result2.text;
        console.log(`🤖 AI: ${text}`);
    } else {
        console.log(`🤖 AI: ${result1.text}`);
    }
}

// Uncomment to run
// main();
