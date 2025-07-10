# Copilot Instructions for Mastering LLMs Workshop

This document provides development guidelines and best practices for contributors working on the Mastering LLMs Workshop repository.

## Python Version Requirements

- **Use Python 3.11 or above** for all code development
- Ensure compatibility with modern Python features and type hints
- Leverage new Python 3.11+ features where appropriate (e.g., improved error messages, performance enhancements)

## Dependency Management

- **Use Poetry** for all dependency management tasks
- Maintain `pyproject.toml` for project configuration and dependencies
- Use `poetry add` for adding new dependencies
- Use `poetry add --group dev` for development dependencies
- Keep `poetry.lock` file committed to ensure reproducible builds
- Use semantic versioning for dependency constraints

### Poetry Commands Reference
```bash
# Install dependencies
poetry install

# Add runtime dependency
poetry add package-name

# Add development dependency  
poetry add --group dev package-name

# Update dependencies
poetry update

# Activate virtual environment
poetry shell
```

## Development Environment

- **Leverage Jupyter Lab** wherever possible for:
  - Interactive development and experimentation
  - Workshop tutorials and demonstrations
  - Data exploration and visualization
  - Prototyping LLM implementations

### Jupyter Best Practices
- Use `.ipynb` files for workshop modules and tutorials
- Include clear markdown documentation within notebooks
- Use meaningful cell outputs and visualizations
- Keep notebooks focused on specific learning objectives

## File Organization and Naming

### Meaningful Filenames
- Use descriptive, lowercase filenames with underscores (snake_case)
- Include version numbers or module identifiers where relevant
- Examples:
  - `01_introduction_to_llms.ipynb`
  - `02_prompt_engineering_basics.ipynb`
  - `llm_utils.py`
  - `data_preprocessing.py`

### Module-wise Workshop Structure
Organize content into logical modules:

```
workshop_modules/
├── 01_foundations/
│   ├── introduction_to_llms.ipynb
│   ├── setup_and_installation.ipynb
│   └── basic_concepts.ipynb
├── 02_prompt_engineering/
│   ├── prompt_design_principles.ipynb
│   ├── advanced_prompting_techniques.ipynb
│   └── prompt_optimization.ipynb
├── 03_fine_tuning/
│   ├── dataset_preparation.ipynb
│   ├── training_process.ipynb
│   └── evaluation_metrics.ipynb
├── 04_deployment/
│   ├── model_serving.ipynb
│   ├── api_development.ipynb
│   └── production_considerations.ipynb
└── utils/
    ├── llm_helpers.py
    ├── data_processing.py
    └── evaluation_tools.py
```

## Documentation Synchronization

### README File Maintenance
- **Always cross-check new additions with the README file**
- Keep changes in sync between implementation and documentation
- Update README.md whenever:
  - New modules or workshops are added
  - Dependencies change
  - Installation instructions are modified
  - Learning objectives are updated

#### Module-wise README File
- Always analyze code files (.py, .ipynb) in the module and understand key topics covered
- The module specific README.md should cover:
  - A title of the module
  - A short description of the module
  - A table of contents with hyperlinks to all notebooks. The hyperlink should be named in a meaningful way. 
  - A block quote at the end mention which model was used to generate the README with a timestamp
  - A horizontal line to close it off.

### Documentation Standards
- Use clear, concise language
- Include code examples where relevant
- Provide step-by-step instructions
- Link to relevant external resources
- Maintain a consistent tone and style

## LLM.txt Maintenance

### Keep llm.txt Updated
- **Update `llm.txt` with each significant change** to the repository
- Document:
  - New files and modules added
  - Dependencies and their purposes
  - Workshop structure changes
  - Key learning resources
  - Setup and installation changes

### LLM.txt Content Guidelines
- Provide a comprehensive overview of the repository
- Include current project structure
- List key technologies and frameworks used
- Document workshop progression and learning path
- Include troubleshooting information

## Code Quality Standards

### General Guidelines
- Write clean, readable, and well-documented code
- Use type hints for function parameters and return values
- Follow PEP 8 style guidelines
- Include docstrings for all functions and classes
- Write meaningful variable and function names

### Testing
- Include unit tests for utility functions
- Test notebook examples and code snippets
- Validate that all workshop materials work end-to-end

### Version Control
- Make atomic commits with descriptive messages
- Use conventional commit format where appropriate
- Keep commits focused on single logical changes
- Update documentation in the same commit as code changes

## Workshop-Specific Guidelines

### Learning Objectives
- Clearly define learning objectives for each module
- Include practical exercises and hands-on components
- Provide both theoretical background and practical implementation
- Include real-world use cases and examples

### Resource Management
- Optimize for computational efficiency in workshops
- Provide alternatives for different computational environments
- Include resource requirements and recommendations
- Consider cloud-based alternatives for resource-intensive tasks

### Accessibility
- Ensure content is accessible to different skill levels
- Provide prerequisite information clearly
- Include multiple learning paths where appropriate
- Support both beginner and advanced participants

## Collaboration Guidelines

- Review and test workshop materials before merging
- Ensure all external links and resources are accessible
- Validate that installation instructions work across different environments
- Coordinate with README updates when making structural changes
- Maintain consistency in style and approach across all modules