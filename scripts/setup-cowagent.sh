#!/bin/bash
# scripts/setup-cowagent.sh

cd cowagent || exit
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -e .
deactivate
cd ..
