
import os
import json
from fastmcp import FastMCP
from scraper_utils import NB_Markdown_Scraper

mcp = FastMCP(
    name="Notebook Server",
    instructions="""
        This server provides a markdown scraper utility
        and a tool to write JSON file
        """,)

class NotebookServer():
    def __init__(self,mcp_instance):
        self.notebook_scraper = NB_Markdown_Scraper(input_paths=[f'../Users/raghavbali/Documents/raghav/work/github/mastering_llms_workshop/docs/{d}' for d in os.listdir("./Users/raghavbali/Documents/raghav/work/github/mastering_llms_workshop/docs/") if d.startswith("module")])
        
        # Register methods  
        mcp_instance.tool(self.greet)
        mcp_instance.tool(self.get_notebook_list)
        mcp_instance.tool(self.get_markdown_from_notebook)
        mcp_instance.tool(self.notebook_scraper.scrape_markdowns)
        mcp_instance.tool(self.write_json)
        mcp_instance.tool(self.add_two_numbers)
        mcp_instance.resource("resource://data")(self.resource_method)

    def greet(self,name: str= None):
        '''Greets the User'''
        if not name:
            return "Hi, I am NotebookServer"
        else:
            return f"Hi {name}, I am NotebookServer"
    def add_two_numbers(self,a: int, b: int) -> int:
        """
        Add two numbers
        Args:
            a: The first integer number
            b: The second integer number
        
        Returns:
            int: The sum of the two numbers
        """
        return a + b

    def get_notebook_list(self):
        '''Returns List of Notebooks Scraped'''
        return list(self.notebook_scraper.notebook_md_dict.keys())

    def get_markdown_from_notebook(self,notebook_name):
        '''Returns Markdown Cells for specified notebook'''
        if notebook_name in list(self.notebook_scraper.notebook_md_dict.keys()):
            return self.notebook_scraper.notebook_md_dict[notebook_name]
        else:
            return f"Requested notebook ({notebook_name}) does not exist"
        
    def write_json(self,file_name: str):
        '''Tool to write a json file in the format notebook:markdown content'''
        try:
            with open(f"./{file_name}", "w") as record_file:
                json.dump(self.notebook_scraper.notebook_md_dict,record_file)
            return f"File:{file_name} written successfully"
        except Exception as ex:
            return f"Could not write {file_name} due to {ex}"
        
    
    def resource_method(self):
        return """
        Resources provide read-only access to data for the LLM or client application. When a client requests a resource URI:
            + FastMCP finds the corresponding resource definition.
            + If it’s dynamic (defined by a function), the function is executed.
            + The content (text, JSON, binary data) is returned to the client.
        This allows LLMs to access files, database content, configuration, or dynamically generated information relevant to the conversation.
        """

# The methods are automatically registered when creating the instance
provider = NotebookServer(mcp)

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')
