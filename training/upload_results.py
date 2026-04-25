import os
from huggingface_hub import HfApi

# Create API client (it automatically picks up HF_TOKEN from environment)
api = HfApi()
repo_id = "SaiSanjayR/GitPRTriage_Environment"

print("Uploading training artifacts to Space...")
try:
    if os.path.exists("evaluation/checkpoints"):
        api.upload_folder(
            folder_path="evaluation/checkpoints",
            repo_id=repo_id,
            path_in_repo="evaluation/checkpoints",
            repo_type="space"
        )
    if os.path.exists("evaluation/plots"):
        api.upload_folder(
            folder_path="evaluation/plots",
            repo_id=repo_id,
            path_in_repo="evaluation/plots",
            repo_type="space"
        )
    if os.path.exists("evaluation/post_training"):
        api.upload_folder(
            folder_path="evaluation/post_training",
            repo_id=repo_id,
            path_in_repo="evaluation/post_training",
            repo_type="space"
        )
    print("✅ Successfully uploaded all artifacts to Hugging Face!")
except Exception as e:
    print(f"Error uploading: {e}")
