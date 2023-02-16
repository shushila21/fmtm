# Copyright (c) 2020, 2021, 2022 Humanitarian OpenStreetMap Team
#
# This file is part of FMTM.
#
#     FMTM is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     FMTM is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with FMTM.  If not, see <https:#www.gnu.org/licenses/>.
#

import json


from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from ..db import database
from ..users import user_crud, user_schemas

from .auth_schemas import AuthUser
from .auth_utils import login_required, osm_auth_api, osm_auth_flask

router = APIRouter(prefix="/auth",
                   tags=["auth"],
                   dependencies=[Depends(database.get_db)],
                   responses={404: {"description": "Not found"}},)


# @router.get("/login/")
# def login(user: user_schemas.UserIn, db: Session = Depends(database.get_db)):
#     return user_crud.verify_user(db, user)


@router.get("/osm_login_api/")
def login_api(request: Request):
    """Generate Login URL from API for authentication using OAuth2 Application registered with OpenStreetMap.
    Click on the download url returned to get access_token.

    Parameters: None

    Returns:
    - login_url (string) - URL to authorize user to the application via. Openstreetmap
        OAuth2 with client_id, redirect_uri, and permission scope as query_string parameters
    """
    login_url = osm_auth_api.login()
    return json.loads(login_url)


@router.get("/callback_api/")
def callback_api(request: Request):
    """Performs token exchange between OpenStreetMap and FMTM API

    Core will use Oauth secret key from configuration while deserializing token,
    provides access token that can be used for authorized endpoints.

    Parameters: None

    Returns:
    - access_token (string)
    """
    access_token = osm_auth_api.callback(str(request.url))

    return json.loads(access_token)


@router.get("/osm_login_flask/")
def login_flask(request: Request):
    """Generate Login URL for authentication using OAuth2 Application registered with OpenStreetMap.
    Click on the download url returned to get access_token.

    Parameters: None

    Returns:
    - login_url (string) - URL to authorize user to the application via. Openstreetmap
        OAuth2 with client_id, redirect_uri, and permission scope as query_string parameters
    """
    login_url = osm_auth_flask.login()
    return json.loads(login_url)


@router.get("/callback_flask/")
def callback_flask(url: str):
    """Performs token exchange between OpenStreetMap and Export tool API

    Core will use Oauth secret key from configuration while deserializing token,
    provides access token that can be used for authorized endpoints.

    Parameters: None

    Returns:
    - access_token (string)
    """
    access_token = osm_auth_flask.callback(url)

    return json.loads(access_token)


@router.get("/me/", response_model=AuthUser)
def my_data(user_data: AuthUser = Depends(login_required)):
    """Read the access token and provide  user details from OSM user's API endpoint,
    also integrated with underpass .

    Parameters:None

    Returns: user_data
    """
    return user_data
