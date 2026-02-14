from config import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from v1.routes import router
from config import config


def create_app():
    app = FastAPI(
        title=config.SERVICE_NAME.replace("_", " "),
        description=config.SERVICE_DESCRIPTION,
        version=config.VERSION,
        openapi_url="/api/v1/{}/openapi.json".format(config.SUBROUTE),
        docs_url="/api/v1/{}/docs".format(config.SUBROUTE),
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router, prefix="/api/v1/{}".format(config.SUBROUTE))

    return app


app = create_app()
