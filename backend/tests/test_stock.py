from data_pipeline import stockhelper


def test_get_data():
    result = stockhelper.get_data('MSFT')
    assert len(result) > 0

