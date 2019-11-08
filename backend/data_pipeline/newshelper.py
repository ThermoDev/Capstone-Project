# News API data obtained from NewsApi.org

import re
import time

import feedparser
import requests

news_api_key = "7ab953b64f764e038808a57ebe9f4aea"

sources = [
    'the-new-york-times',
    'cnn',
    'reuters',
    'business-insider',
    'business-insider-uk',
    'financial-post',
    'the-wall-street-journal',
    'cnbc',
    'bloomberg',
    'techcrunch',
    'australian-financial-review',
    'fortune'
]

sources = ",".join(sources)

yahoo_finance_rss_url = "https://finance.yahoo.com/rss/"

def retrieve_headlines() -> dict:
    """
    Function to retrieve latest news headlines

    Returns
    -------
    dict
        A dictionary which contains the latest top headlines obtained from Yahoo Finance
    """
    feed = feedparser.parse(yahoo_finance_rss_url)
    news = []

    cleaner = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')

    entries = feed["entries"]
    for post in entries:
        title = post["title"]

        clean_summary = re.sub(cleaner, '', post["summary"])
        if len(clean_summary) > 150:
            clean_summary = clean_summary[:150].rstrip()
            clean_summary += "..."

        published = post["published_parsed"]
        published = time.strftime('%Y-%m-%dT%H:%M:%SZ', published)
        source = {"id": None, "name": "Yahoo Finance"}
        url = post["link"]
        url_to_image = post["media_content"][0]["url"]

        news_entry = {"author": "Yahoo Finance", "content": None, "description": clean_summary,
                      "publishedAt": published, "source": source, "title": title, "url": url,
                      "urlToImage": url_to_image}

        news.append(news_entry)

    json_news = {"articles": news, "status": "ok", "totalResults": len(news)}
    return json_news


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
           '&sources=' + sources +
           '&apiKey=' + news_api_key)
    response = requests.get(url)
    return response.json()
