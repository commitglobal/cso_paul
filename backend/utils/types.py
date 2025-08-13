from typing import Any, Dict, Union

from django.http import HttpResponsePermanentRedirect, HttpResponseRedirect

type DictResponse = Dict[str, Any]  # TODO: Better define this type

type RedirectionResponse = Union[HttpResponseRedirect, HttpResponsePermanentRedirect]
