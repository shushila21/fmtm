import os

from fastapi import Header, HTTPException
from osm_login_python.core import Auth

from ..env_utils import config_env


# config plan
osm_auth_api = Auth(
    osm_url=config_env["OSM_URL"],
    client_id=config_env["OSM_API_CLIENT_ID"],
    client_secret=config_env["OSM_API_CLIENT_SECRET"],
    secret_key=config_env["OSM_API_SECRET_KEY"],
    login_redirect_uri=config_env["OSM_API_LOGIN_REDIRECT_URI"],
    scope=config_env["OSM_SCOPE"],
)

osm_auth_flask = Auth(
    osm_url=config_env["OSM_URL"],
    client_id=config_env["OSM_FLASK_CLIENT_ID"],
    client_secret=config_env["OSM_FLASK_CLIENT_SECRET"],
    secret_key=config_env["OSM_FLASK_SECRET_KEY"],
    login_redirect_uri=config_env["OSM_FLASK_LOGIN_REDIRECT_URI"],
    scope=config_env["OSM_SCOPE"],
)

# TODO: explain in code comments how to use this


def login_required(access_token: str = Header(...)):
    try:
        return osm_auth_flask.deserialize_access_token(access_token)
    except:
        # TODO: something other that try catches should be used for this bussiness logic
        try:
            return osm_auth_api.deserialize_access_token(access_token)
        except:
            raise HTTPException(401, "Access token is not valid")
