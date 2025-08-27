from typing import Optional

from pydantic import BaseModel


class PaginationInfo(BaseModel):
    has_next: bool
    has_previous: bool
    num_pages: int
    current_page: int
    next_page_number: Optional[int]
    previous_page_number: Optional[int]
    total_items: int
    per_page: int
