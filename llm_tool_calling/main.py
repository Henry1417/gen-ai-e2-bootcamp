"""
LLM Tool Calling - Retail Inventory System (Refactored)
Vertical: Retail

Architecture:
- InventoryService: Handles business logic (Simulated DB).
- LLMClient: Handles orchestration with Ollama (Llama 3.2).
- Main: Application entry point.
"""

import ollama
import json
from typing import Dict, Any, List, Optional

# --- 1. MOCK DATABASE & MODELS ---
# En Java esto sería tu Entity/DTO
INVENTORY_MOCK: Dict[str, Dict[str, Any]] = {
    "laptop-001": {"name": "Laptop Dell XPS 15", "price": 1299.99, "stock": 15, "location": "A-3"},
    "phone-002":  {"name": "iPhone 15 Pro",      "price": 999.99,  "stock": 8,  "location": "A-1"},
    "chair-003":  {"name": "Silla OfficeMax",    "price": 249.99,  "stock": 25, "location": "B-5"},
}

# --- 2. SERVICE LAYER ---
class InventoryService:
    """
    Servicio de Negocio. En Spring Boot esto llevaría @Service.
    Contiene la lógica pura sin saber nada del LLM.
    """
    
    @staticmethod
    def get_product_details(product_id: str) -> str:
        """
        Busca un producto por ID.
        Retorna string JSON para facilitar la ingesta por el LLM.
        """
        print(f"   ⚙️ [SERVICE] Consultando DB para ID: {product_id}...")
        
        product = INVENTORY_MOCK.get(product_id)
        
        result = {
            "success": product is not None,
            "product_id": product_id,
            "data": product if product else "Producto no encontrado",
            "metadata": {"available_ids": list(INVENTORY_MOCK.keys())} # Contexto extra útil si falla
        }
        
        # Serializamos a string porque el LLM consume texto
        return json.dumps(result, ensure_ascii=False)

# --- 3. INFRASTRUCTURE / LLM LAYER ---
class LLMAgent:
    """
    Orquestador de IA. Maneja la comunicación con Ollama.
    """
    
    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name
        # Registry de herramientas disponibles (Function Registry)
        self.available_functions = {
            'get_product_details': InventoryService.get_product_details
        }

    def _get_tool_definitions(self) -> List[Dict]:
        """
        Define el 'Contrato' (Interface) que el LLM puede ver.
        Describe qué hacen las funciones y qué parámetros requieren.
        """
        return [{
            'type': 'function',
            'function': {
                'name': 'get_product_details',
                'description': 'Obtiene stock, precio y ubicación de un producto por su ID.',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'product_id': {
                            'type': 'string',
                            'description': 'ID del producto (ej: laptop-001, phone-002)'
                        }
                    },
                    'required': ['product_id']
                }
            }
        }]

    def chat(self, user_query: str):
        """
        Procesa el loop de conversación:
        1. User Query -> LLM
        2. LLM -> Decision (Tool Call?)
        3. Tool Call -> Execution -> Result
        4. Result -> LLM -> Final Answer
        """
        print(f"\n💬 USER: {user_query}")
        
        messages = [{'role': 'user', 'content': user_query}]
        
        try:
            # First Pass: Enviamos prompt + definiciones de herramientas
            response = ollama.chat(
                model=self.model_name,
                messages=messages,
                tools=self._get_tool_definitions()
            )
            
            msg_content = response['message']
            
            # Chequeamos si el LLM quiere ejecutar herramientas (Reflection)
            if msg_content.get('tool_calls'):
                self._handle_tool_calls(messages, msg_content)
                
                # Second Pass: Enviamos el resultado de la herramienta para la respuesta final
                final_response = ollama.chat(model=self.model_name, messages=messages)
                print(f"🤖 AI: {final_response['message']['content']}")
            else:
                # Flujo normal sin herramientas
                print(f"🤖 AI: {msg_content['content']}")

        except Exception as e:
            print(f"❌ ERROR CRÍTICO: Asegúrate de correr 'ollama serve'. Detalles: {e}")

    def _handle_tool_calls(self, messages: List[Dict], original_msg: Dict):
        """Maneja la ejecución de las herramientas solicitadas."""
        # Agregamos la "intención" del asistente al historial
        messages.append(original_msg)
        
        for tool in original_msg['tool_calls']:
            fn_name = tool['function']['name']
            fn_args = tool['function']['arguments']
            
            print(f"⚡ [LLM DECISION] Ejecutar: {fn_name} con args {fn_args}")
            
            # Dynamic Dispatch: Buscamos la función en nuestro registro
            function_to_call = self.available_functions.get(fn_name)
            
            if function_to_call:
                # Invocación real
                tool_output = function_to_call(**fn_args)
                
                # Inyectamos el resultado como un mensaje tipo 'tool'
                messages.append({
                    'role': 'tool',
                    'content': tool_output,
                })
            else:
                print(f"⚠️ Herramienta {fn_name} no implementada.")

# --- 4. MAIN APPLICATION ---
def main():
    print("🚀 Iniciando Sistema de Retail AI (Llama 3.2 Local)...")
    
    agent = LLMAgent()
    
    # Caso 1: Happy Path con Tool
    # El LLM debe extraer 'laptop-001' y llamar al servicio
    agent.chat("Necesito verificar el stock de la laptop-001")
    
    # Caso 2: Happy Path con Tool (consulta compleja)
    # El LLM debe entender que 'phone-002' es el ID
    agent.chat("¿Cuál es el precio del phone-002 y dónde está guardado?")
    
    # Caso 3: Conocimiento General (Sin Tool)
    agent.chat("¿Qué opinas sobre el futuro del retail?")

if __name__ == "__main__":
    main()
