from django.db.models import QuerySet


class FakeQS(QuerySet):
    """
    Minimal, sliceable, in-memory queryset substitute for tests.

    Features:
    - Iterable and sliceable (supports Django Paginator slicing)
    - count() for page_size="all"
    - filter() supporting equality, __in, __gte, __lte
    - annotate() no-op that marks a flag

    Also tracks annotate/filter calls (annotated, filtered, filter_kwargs) used by some tests.
    """

    def __init__(self, items=None):
        super().__init__()
        self.items = list(items or [])
        self.annotated: bool = False
        self.filtered: bool = False
        self.filter_kwargs = None

    def __getitem__(self, key):
        return self.items[key]

    def count(self) -> int:
        return len(self.items)

    # QuerySet-like helpers
    def annotate(self, *args, **kwargs):
        self.annotated = True
        return self

    def filter(self, **kwargs):
        # Track filter usage for tests that assert calls
        self.filtered = True
        self.filter_kwargs = kwargs

        # If only a SearchVector filter was applied, mimic queryset chaining by returning self
        if set(kwargs.keys()) == {"search"}:
            return self

        result = self.items
        for key, value in kwargs.items():
            if key.endswith("__in"):
                field = key[:-4]
                result = [i for i in result if i.get(field) in value]
            elif key.endswith("__gte"):
                field = key[:-5]
                result = [i for i in result if i.get(field) >= value]
            elif key.endswith("__lte"):
                field = key[:-5]
                result = [i for i in result if i.get(field) <= value]
            else:
                result = [i for i in result if i.get(key) == value]

        return FakeQS(result)
