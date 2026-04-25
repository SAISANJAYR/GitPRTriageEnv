# Use a more robust base for ML if training is desired, but for environment shim, slim is fine.
# For Unsloth/Training, we'd ideally want a CUDA base, but let's stick to the server first
# and add the training deps to requirements.txt.

FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies for some ML packages
RUN apt-get update && apt-get install -y git build-essential && rm -rf /var/lib/apt/lists/*

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything
COPY . .

# HF Spaces uses port 7860
EXPOSE 7860

# Start server - Important: point to prevaluation_env
CMD ["uvicorn", "prevaluation_env.server.app:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "2"]
