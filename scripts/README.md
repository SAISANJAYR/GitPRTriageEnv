# GitPRTriageEnv Scripts 🛠️

This directory contains utility scripts for managing the project infrastructure, connecting to Hugging Face Spaces, and handling deployment.

## Included Scripts

- **`switch_workspace.py`**: An interactive tool designed for teammates to quickly switch the active Hugging Face username and Space namespace. Run this if you are deploying the environment on your personal account instead of `rsd-06`.
- **`upload_rsd_space.py`** & **`upload_space.py`**: Scripts to push the Dockerized environment (`prevaluation_env/` server, PR data, and `Dockerfile`) directly to your Hugging Face Space.
- **`get_logs.py`**: A helper to fetch the raw console logs of the remote Hugging Face training jobs.
- **`build_grpo_dataset.py`** & **`push_dataset_jsonl.py`**: Utilities to prepare and upload the PR dataset into JSONL format for the Hugging Face Datasets hub, which is required for remote GRPO training.
- **`submit_job.py`**: Script to submit training jobs to HF cloud.

## Usage

Most scripts are designed to be run from the root directory of the project:
```bash
python scripts/switch_workspace.py
```
