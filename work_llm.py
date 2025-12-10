import ollama

mensaje = """¿Que me sugieres hacer en un día frio?"""

llm = "llama3.2"

response = ollama.chat(model=llm, messages=[
	{
		'role': 'user',
		'content': mensaje,
	},
])
print(response['message']['content'])