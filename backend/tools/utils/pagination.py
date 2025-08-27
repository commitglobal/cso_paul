from typing import Dict, List, Optional, Tuple, Union

from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db.models import QuerySet

from tools.data_models.pagination import PaginationInfo


def paginate_queryset(
    queryset: QuerySet,
    page_number: int,
    page_size: Union[int, str] = 10,
    page_serializer: Optional[callable] = None,
    serializer_kwargs: Optional[Dict] = None,
) -> Tuple[List, Paginator, PaginationInfo]:
    """
    Reusable pagination logic for Django QuerySets.
    Returns (page_obj, paginator, pagination_dict)
    """
    if isinstance(page_size, str) and page_size == "all":
        page_size = queryset.count() or 1

    paginator = Paginator(queryset, page_size)

    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    pagination = PaginationInfo(
        has_next=page_obj.has_next(),
        has_previous=page_obj.has_previous(),
        num_pages=paginator.num_pages,
        current_page=page_obj.number,
        next_page_number=page_obj.next_page_number() if page_obj.has_next() else None,
        previous_page_number=page_obj.previous_page_number() if page_obj.has_previous() else None,
        total_items=paginator.count,
        per_page=paginator.per_page,
    )

    if page_serializer:
        page_list: List = page_serializer(page_obj, **(serializer_kwargs or {}))
    else:
        page_list: List = list(page_obj)

    return page_list, paginator, pagination
