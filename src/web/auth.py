# Copyright (c) 2020, 2021, 2022 Humanitarian OpenStreetMap Team
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

import os
import functools
from flask import (Blueprint, flash, g, redirect, render_template, request,
                   session, url_for, make_response)
from werkzeug.security import check_password_hash, generate_password_hash

# api
import requests

bp = Blueprint("auth", __name__, url_prefix="/auth")
base_url = os.getenv("API_URL")


class User:
    def __init__(self, id, username, img_url):
        self.id = id
        self.username = username
        self.img_url = img_url


@bp.route("/login", methods=("GET", "POST"))
def login():
    try:
        with requests.Session() as s:
            response = s.get(
                f"{base_url}/auth/osm_login_flask/")
            if response.status_code == 200:
                response_dict = response.json()

                login_url = response_dict.get('login_url')

                return redirect(login_url, 301)
            else:
                error = f"Response was not sucessful. See: {response.json()}"

    except Exception as e:
        error = f"Login failed due to {e}"

    flash(error)
    return redirect(url_for("index"))


@bp.route("/success", methods=("GET", "POST"))
def callback():
    try:
        with requests.Session() as s:
            response = s.get(
                f"{base_url}/auth/callback_flask/",  params={'url': str(request.url)})
            if response.status_code == 200:
                response_dict = response.json()

                access_token = response_dict.get('access_token')

                # return to previous page if there is one
                if 'url' in session:
                    resp = set_user_token(access_token, session['url'])
                else:
                    resp = set_user_token(access_token, "index")

                get_user_details(access_token)

                return resp, 302
            else:
                error = f"Response was not sucessful. See: {response.json()}"

    except Exception as e:
        error = f"Login failed due to {e}"

    flash(error)
    return redirect(url_for("index"))


@bp.route("/logout")
def logout():
    resp = set_user_token(None, "index")
    return resp, 302


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")

    if user_id is None:
        g.user = None
    else:
        g.user = User(user_id, session["username"], session['user_img_url'])


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))
        return view(**kwargs)

    return wrapped_view


def set_user_token(access_token: str, where_to_next: str):
    resp = make_response()
    if (access_token):
        resp.set_cookie('osm_token', access_token)
        session['osm_token'] = access_token
    else:
        resp.set_cookie('osm_token', '', expires=0)
        session.clear()  # assumes that this is a logout
    resp.headers['location'] = url_for(where_to_next)
    return resp


def remove_user_tokens(where_to_next: str = "index"):
    return set_user_token(None, where_to_next)


def get_user_details(access_token: str):
    with requests.Session() as s:
        response = s.get(
            f"{base_url}/auth/me/",  headers={'access-token': access_token})
        if response.status_code == 200:
            response_dict = response.json()

            session['user_id'] = response_dict['id']
            session['username'] = response_dict['username']
            session['user_img_url'] = response_dict['img_url']
        else:
            # assume this token is bad and logout
            flash(f"Could not get user details: {response.json()}")
            remove_user_tokens()
