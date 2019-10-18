from setuptools import find_packages, setup

setup(
    name='api_server',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask',
        'numpy',
        'python-dotenv',
        'pytest',
        'coverage',
        'pandas',
        'matplotlib',
        'pandas-datareader',
        'yfinance',
        'flask-cors'
    ],
)
