
import os
import json
from fastmcp import FastMCP
from scraper_utils import NB_Markdown_Scraper

mcp = FastMCP(
    name="Calculation Server",
    instructions="""
        This server provides mathematical capabilities
        """,)

@mcp.tool
def greet(self,name: str= None):
    '''Greets the User'''
    if not name:
        return "Hi, I am NotebookServer"
    else:
        return f"Hi {name}, I am NotebookServer"

@mcp.tool
def add_two_numbers(a: int, b: int) -> int:
    """
    Add two numbers
    Args:
        a: The first integer number
        b: The second integer number
    
    Returns:
        int: The sum of the two numbers
    """
    return a + b

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')
