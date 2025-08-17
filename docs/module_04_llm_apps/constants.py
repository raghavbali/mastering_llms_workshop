#####################
## Set Constants
#####################
HF_TOKEN = '<YOUR TOKEN>'
OPENAI_TOKEN = '<YOUR TOKEN>'
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}
# Constants for embedding model
EMB_MODEL_ID = 'pinecone/mpnet-retriever-discourse'
EMB_API_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{EMB_MODEL_ID}"

# Constants for QA model
QA_MODEL_ID = 'deepset/roberta-base-squad2'

# List of Different Endpoints
HF_LM_ENDPOINT = 'HF-LM'
OPENAI_ENDPOINT = 'OPENAI-LM'
LOCAL_OLLAMA_ENDPOINT = 'OLLAMA'
AVAILABLE_LMs = {
    'models':
    [
        'HuggingFaceTB/SmolLM3-3B',
        'Local-LLAMA-3.1:8b',
        'OpenAI-GPT4o-mini'
    ],
    'endpoints':
    [
        HF_LM_ENDPOINT,
        LOCAL_OLLAMA_ENDPOINT,
        OPENAI_ENDPOINT,
    ]
}