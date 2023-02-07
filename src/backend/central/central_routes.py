# Copyright (c) 2023 Humanitarian OpenStreetMap Team
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

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
import logging.config
import json
from os import getenv
from fastapi.logger import logger as logger
from fastapi.responses import FileResponse

from ..db import database
from ..models.enums import TaskStatus
from ..users import user_schemas, user_crud
from ..central import central_schemas, central_crud
from ..projects import project_schemas, project_crud
from ..env_utils import is_docker, config_env

# # FIXME: I am not sure this is thread-safe
# from ..odkconvert.OdkCentral import OdkProject, OdkAppUser, OdkForm
# project = OdkProject()
# xform = OdkForm()
# appuser = OdkAppUser()

# url = config_env["ODK_CENTRAL_URL"]
# user = config_env["ODK_CENTRAL_USER"]
# pw = config_env["ODK_CENTRAL_PASSWD"]
# project.authenticate(url, user, pw)

router = APIRouter(
    prefix="/central",
    tags=["central"],
    dependencies=[Depends(database.get_db)],
    responses={404: {"description": "Not found"}},
)

@router.get("/appuser")
async def create_appuser(name):
    """Create an appuser in Central"""
    logger.info("/central/appuser is Unimplemented!")
    return {"message": "Hello World from /central/appuser"}

# @router.get("/project")
# async def create_project(name: str, boundary: str):
#     """Create a project in Central"""
#     project.listProjects()
#     result = project.createProject(name)
#     logger.info(f"Project {name} has been created on the ODK Central server.")
#     import epdb; epdb.st()
#     user = user_schemas.User(author='', city='', country='', username='', id=0)
#     info = project_schemas.ProjectInfo(name=result['name'],
#                                              locale=getenv('LANG'),
#                                              id=result['id'],
#                                              short_description='',
#                                              description='',
#                                              instructions='',
#                                              per_task_instructions='',
#                                              )
#     project = project_crud.create_project_with_project_info(db, project_info)

#     data = json.dumps(result)
#     return {"message": f"Project {name} created", "data": {data}}

@router.get("/submissions")
async def download_submissions(project_id: int, xform_id: str):
    """Download the submissions data from Central"""
    logger.info("/central/submissions is Unimplemented!")
    return {"message": "Hello World from /central/submisisons"}

@router.get("/upload")
async def upload_project_files(project_id: int, filespec: str):
    """Upload the XForm and data files to Central"""
    logger.warning("/central/upload is Unimplemented!")
    return {"message": "Hello World from /central/upload"}

@router.get("/download")
async def download_project_files(project_id: int, type: central_schemas.CentralFileType):
    """Download the project data files from Central. The filespec is
    a string that can contain multiple filenames separeted by a comma.
    """
    # FileResponse("README.md")
    #xxx = central_crud.does_central_exist()
    logger.warning("/central/download is Unimplemented!")
    return {"message": "Hello World from /central/download"}
