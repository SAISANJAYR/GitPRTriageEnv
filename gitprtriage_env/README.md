---
title: DevTriage Environment
sdk: docker
tags:
  - openenv
---
# DevTriageEnv
A GitHub issue triage environment where an LLM agent reads issues and PRs, classifies them, finds bug lines in code, routes to the right team, and suggests fixes. 
Built for the **Meta × Scaler OpenEnv Hackathon 2026**.

## Description
This environment models a genuine, real-world task: issue management and triage in a software development context.
The environment exposes a REST API via FastAPI, fully compliant with OpenEnv specifications (typed models, `step()`/`reset()`/`state()`, and metadata in `openenv.yaml`).

## Setup and Usage

### Prerequisites
- Docker (optional but recommended for running exactly like HF Spaces)
- Python 3.11

### Running Locally (Native)

1. Set your environment variables (PowerShell example):
   ```powershell
   $env:HF_TOKEN = "gsk_yourGroqKeyHere"
   $env:API_BASE_URL = "https://api.groq.com/openai/v1"
   $env:MODEL_NAME = "llama-3.1-8b-instant"
   $env:ENV_URL = "http://localhost:7860"
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server (on port 7860):
   ```bash
   uvicorn server.app:app --host 0.0.0.0 --port 7860 --reload
   ```

4. Test in browser:
   Visit http://localhost:7860/docs

### Running via Docker
```bash
docker build -t dev-triage-env .
docker run -p 7860:7860 dev-triage-env
```

### Deploying to HuggingFace Spaces
1. Create a newly hosted Space on Hugging Face.
2. Select **Docker** as the Space SDK.
3. Choose the "Blank" Docker template (it defaults to port 7860).
4. Commit all files in this directory to the Space repository.
5. Hugging Face Spaces will automatically find the root `Dockerfile` and deploy the application.

### Baseline Inference
We include a baseline reasoning script that parses the `localhost:7860` server via REST calls and performs inference.
```bash
python inference.py
```

## Task Difficulties & Graders

1. **Easy (Issue Classification):** Classify issue as bug, feature, or duplicate. Score 0 or 1.
2. **Medium (Bug Line Identification):** Classify + find exact bug line. Partial credit for proximity.
3. **Hard (Full Triage + Fix Suggestion):** Classify + bug line + team routing + keyword-checked fix.

Action and observation spaces use typed Pydantic models (see `models.py`). Every task features a non-gameable deterministic grader bounded strictly between [0.0, 1.0].

### Baseline Scores (CoT Improved)
| Difficulty | Average Score |
|------------|---------------|
| Easy       | 1.000 ± 0.000 |
| Medium     | 0.800 ± 0.000 |
| Hard       | 0.800 ± 0.000 |
