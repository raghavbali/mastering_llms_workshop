from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from typing import List
import asyncio
import nest_asyncio
# from ollama import Client
import ollama


nest_asyncio.apply()

class MCP_ChatBot:

    def __init__(self):
        # Initialize session and client objects
        self.session: ClientSession = None
        self.available_tools: List[dict] = []
        # self.open_ai_compat_client = Client(
        #     host='http://localhost:11434',
        #     # headers={'x-some-header': 'some-value'}
        # )
        self.model_name = 'llama3.1'

    async def process_query(self, query):
        messages = [{'role':'user', 'content':query}]
        response = ollama.chat(
            model=self.model_name, 
            messages=messages,tools=self.available_tools) #self.open_ai_compat_client
        process_query = True
        print(response)
        while process_query:
            assistant_content = []
            # for content in response.message.content:
            content = response.message.content
            tool_calls = response.message.tool_calls
            
            if not tool_calls:
                print("No tool calls detected")
                assistant_content.append(content)
                if(len(response.message.content) >1):
                    process_query= False
            elif tool_calls:
                print(" tool calls detected")
                assistant_content.append(content)
                messages.append({'role':'assistant', 'content':assistant_content})
                tool_args = tool_calls.function.arguments
                tool_name = tool_calls.function.name

                print(f"Calling tool {tool_name} with args {tool_args}")
                
                # Call a tool
                # tool invocation through the client session
                result = await self.session.call_tool(tool_name, arguments=tool_args)
                messages.append({"role": "user", 
                                  "message": [
                                      {
                                          # "tool_use_id":tool_id,
                                          "content": result.message.content
                                      }
                                  ]
                                })
                response = self.open_ai_compat_client.chat(model=self.model_name, messages=messages,tools=self.available_tools)                
                if not response.message.tool_calls:
                    print(response.message.content)
                    process_query= False

    
    
    async def chat_loop(self):
        """Run an interactive chat loop"""
        print("\nMCP Chatbot Started!")
        print("Type your queries or 'quit' to exit.")
        
        while True:
            try:
                query = input("\nQuery: ").strip()
        
                if query.lower() == 'quit':
                    break
                    
                await self.process_query(query)
                print("\n")
                    
            except Exception as e:
                print(f"\nError: {str(e)}")
    
    async def connect_to_server_and_run(self):
        # Create server parameters for stdio connection
        server_params = StdioServerParameters(
            command="python3",  # Executable
            args=["calculation_server.py"],  # Optional command line arguments
            env=None,  # Optional environment variables
        )
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                self.session = session
                # Initialize the connection
                await session.initialize()
    
                # List available tools
                response = await session.list_tools()
                
                tools = response.tools
                print("\nConnected to server with tools:", [tool.name for tool in tools])
                
                self.available_tools = [{
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.inputSchema,
                } for tool in response.tools]
    
                await self.chat_loop()


async def main():
    chatbot = MCP_ChatBot()
    await chatbot.connect_to_server_and_run()
  

if __name__ == "__main__":
    asyncio.run(main())
