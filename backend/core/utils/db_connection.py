import mongoengine
from config import config

mongoengine.connect(
    config.DATABASE_NAME,
    host="mongodb://{}:{}@{}:{}/?authSource={}&readPreference=primary&directConnection=true&ssl=false".format(
        config.DATABASE_USERNAME,
        config.DATABASE_PASSWORD,
        config.DATABASE_HOST,
        27017,
        config.DATABASE_AUTHENTICATION_SOURCE,
    ),
)
