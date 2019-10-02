import pytest
from api_server.db import get_db


def test_index(client):
    response = client.get('/api/v1/')
    assert b"martinle" in response.data
