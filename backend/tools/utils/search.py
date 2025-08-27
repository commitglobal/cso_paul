import logging
from typing import List

from django.contrib.postgres.search import SearchQuery, SearchVector
from django.db.models import QuerySet

logger = logging.getLogger(__name__)


def search(query: str, queryset: QuerySet, language_code: str, search_fields: List[str]) -> QuerySet:
    """
    Perform a search on the given queryset using the provided query and language code.
    """
    if not query:
        return queryset

    logger.info(f"Searching for '{query}' in fields: {search_fields} with language code: {language_code}")

    search_vector = SearchVector(*search_fields)
    search_query = SearchQuery(query)

    return queryset.annotate(search=search_vector).filter(search=search_query)
