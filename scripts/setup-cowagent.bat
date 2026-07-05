@echo off
REM scripts/setup-cowagent.bat

cd cowagent
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
pip install -e .
call deactivate
cd ..
