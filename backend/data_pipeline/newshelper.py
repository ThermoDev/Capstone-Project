# News API data obtained from NewsApi.org

import requests

news_api_key = "7ab953b64f764e038808a57ebe9f4aea"


def retrieve_headlines(country: str = "us") -> dict:
    """
    Function to retrieve latest news headlines

    Parameters
    ----------
    country: str, optional
        The country code to be used (e.g., 'au', 'us')

    Returns
    -------
    dict
        A dictionary which contains the latest top headlines from US
    """
    url = ('https://newsapi.org/v2/top-headlines?'
           'country=' + country +
           '&apiKey=' + news_api_key)
    response = requests.get(url)
    return response.json()


def search_news(search_term: str) -> dict:
    """
    Function to search news articles containing the query

    Parameters
    ----------
    search_term: str
        The search term that will search through articles

    Returns
    -------
    dict
        A dictionary which contains all news articles containing the search term
    """
    url = ('https://newsapi.org/v2/everything?'
           'q=' + search_term +
           '&apiKey=' + news_api_key)
    response = requests.get(url)
    return response.json()
