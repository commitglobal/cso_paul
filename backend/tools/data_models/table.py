from typing import Any

from pydantic import BaseModel


class TableHeader(BaseModel):
    header: str
    accessorKey: str
    enableSorting: bool = False


class DataTable(BaseModel):
    totalItems: int
    totalPages: int
    header: list[TableHeader]
    items: list[Any]
