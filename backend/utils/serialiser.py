from datetime import datetime

from numpy import float32, float64

def serialise_properties(obj):
    if type(obj) in (int, float, float32, float64, bool, str):
        return obj

    if type(obj) in (list, tuple):
        return [serialise_properties(item) for item in obj]

    if type(obj) is dict:
        serialised = {}
        for key, value in obj.items():
            serialised[serialise_properties(key)] = serialise_properties(value)

        return serialised

    if type(obj) is datetime:
        return obj.isoformat()

    serialised = {}
    for key, value in _get_properties(obj):
        if key != "password":
            serialised[key] = serialise_properties(value)

    return serialised

def _get_properties(obj):
    class_items = obj.__class__.__dict__.items()
    properties = []
    for key, value in class_items:
        if isinstance(value, property):
            properties.append((key, getattr(obj, key)))

    return properties
