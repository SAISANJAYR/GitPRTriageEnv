import requests, json, os

HF_TOKEN = os.getenv("HF_TOKEN") # Set this in your environment variables
JOB_ID   = "69edb37ad70108f37acdfbe1"
headers  = {"Authorization": f"Bearer {HF_TOKEN}"}

# Check status
st = requests.get(f"https://huggingface.co/api/jobs/rsd-06/{JOB_ID}", headers=headers).json()
stage = st.get("status", {}).get("stage", "unknown")
print("Status:", stage)

# Fetch logs (non-streaming)
resp = requests.get(
    f"https://huggingface.co/api/jobs/rsd-06/{JOB_ID}/logs",
    headers=headers,
    stream=False,
    timeout=10
)
text = resp.text.encode("ascii", "replace").decode("ascii")
print(text[-3000:])
