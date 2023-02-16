from pydantic import BaseModel
from typing import Union

class AuthUser(BaseModel):
    id: int
    username: str
    img_url: Union[str, None]