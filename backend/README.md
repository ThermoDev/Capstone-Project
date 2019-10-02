#Setup

**Assumptions**

1. You have installed Python 3.7.\*
2. You have `npm` installed.

## Environment

By default, a Python package called `venv` comes preinstalled with your Python distribution. We will be creating using this package to create an isolated environment for our python application.

1. Create a new virtual environment (venv):
   `cd backend`
   `python3 -m venv ./venv`

2. To activate your venv:
   `source venv/bin/activate`

3. To deactivate your venv, just hit Ctrl + D.

## Installing the Application

`pip install -e .`

## Running the application

`flask run`

## Running tests

`pytest`
`coverage run -m pytest`
`coverage report`
