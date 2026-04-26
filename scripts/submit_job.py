"""
Submits train_v2.py to HF Jobs via the REST API directly,
bypassing the CLI's /whoami-v2 rate-limited endpoint.
"""
import base64, sys, requests, os

HF_TOKEN   = os.getenv("HF_TOKEN")
WANDB_KEY  = os.getenv("WANDB_API_KEY")
OWNER      = "rsd-06"
SCRIPT     = "train_v2.py"
FLAVOR     = "a10g-small"
TIMEOUT    = 14400   # 4 hours in seconds

# The 'uv run' job type uses this standard image
DOCKER_IMAGE = "huggingface/hf-jobs-uv:latest"

# Read and base64-encode the script
with open(SCRIPT, "rb") as f:
    script_b64 = base64.b64encode(f.read()).decode("ascii")

payload = {
    "flavor": FLAVOR,
    "timeout": TIMEOUT,
    "dockerImage": DOCKER_IMAGE,
    "command": [
        "bash", "-c",
        f'echo $LOCAL_FILES_ENCODED | xargs -n 2 bash -c \'echo "$1" | base64 -d > "$0"\' && uv run \'{SCRIPT}\''
    ],
    "secrets": {
        "HF_TOKEN": HF_TOKEN,
        "WANDB_API_KEY": WANDB_KEY,
    },
    "localFiles": [
        [SCRIPT, script_b64]
    ],
}

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type":  "application/json",
}

resp = requests.post(
    f"https://huggingface.co/api/jobs/{OWNER}",
    json=payload,
    headers=headers,
)

text = resp.text.encode("ascii", "replace").decode("ascii")

if resp.ok:
    job = resp.json()
    job_id = job.get("jobId") or job.get("_id") or job.get("id")
    print("[OK] Job submitted!")
    print(f"   Job ID : {job_id}")
    print(f"   Status : {job.get('status', {}).get('stage', 'SCHEDULING')}")
    print(f"   GPU    : {FLAVOR}")
    print(f"   View   : https://huggingface.co/{OWNER}/jobs/{job_id}")
else:
    print(f"[FAIL] HTTP {resp.status_code}")
    print(text[:1000])
