import asyncio
from fastmcp import Client, FastMCP

# In-memory server (ideal for testing)
server = FastMCP("TestServer")
client = Client(server)

# HTTP server
client = Client("https://example.com/mcp")

# Local Python script
client = Client("notebook_server.py")

async def main():
    async with client:
        # Basic server interaction
        await client.ping()
        
        # List available operations
        tools = await client.list_tools()
        resources = await client.list_resources()
        prompts = await client.list_prompts()
        
        print("-"*30)
        print("Tools:")
        print("-"*30)
        print(tools)
        print("-"*30)
        print("Resources:")
        print("-"*30)
        print(resources)
        print("-"*30)
        print("Prompts:")
        print(prompts)
        print("-"*30)
        # Execute operations
        await client.call_tool("scrape_markdowns", {})
        result = await client.call_tool("write_json", {"file_name":"test_mcp_server.json"})
        print("-"*30)
        print(f"Result of tool call for write_json:\n{result}")

asyncio.run(main())
