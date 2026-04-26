# Model Training 🧠

This directory contains the reinforcement learning scripts to train the LLM agent using GRPO (Group Relative Policy Optimization). 

## Included Files

- **`train.py` (Stage 1)**: Trains the initial V1 model using direct rewards. Focuses on schema learning and basic defect detection.
- **`train_v2.py` (Stage 2)**: The advanced curriculum learning script. Uses rolling averages to progressively shift the dataset difficulty from Easy to Hard, and implements inline reward-hacking guardrails (diversity and contradiction penalties). Includes dual `fast` (offline) and `live` (HF Space telemetry) modes.
- **`collect_baseline.py` & `collect_post_training*.py`**: Evaluation scripts that run standard model inference (without RL updates) against the PR dataset to collect raw benchmarks.
- **`reward_fn.py`**: Contains the offline deterministic grader that accurately scores JSON outputs based on `prs.json` ground truths.
- **`test_guards_smoke.py`**: A small suite of unit/smoke tests to verify that the inline guardrail penalties correctly deduct reward points for bad behavior.
- **`grpo_training.ipynb`**: An interactive Jupyter Notebook version of the training loop for debugging and experimentation.

## Running Training

The advanced V2 model can be run from the root directory:

```bash
# Pure offline training (max speed)
python training/train_v2.py --mode fast

# Live telemetry training (sends POST to /grade_stateless every 3 steps to update the dashboard)
python training/train_v2.py --mode live
```
