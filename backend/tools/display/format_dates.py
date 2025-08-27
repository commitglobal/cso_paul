from datetime import datetime


def short_date(date: datetime) -> str:
    """
    Returns a short date string in the format 'DD.MM.YYYY'.
    """
    if not date:
        return "—"
    return date.strftime("%d.%m.%Y")


def short_datetime(date: datetime) -> str:
    """
    Returns a short datetime string in the format 'DD.MM.YYYY, HH:MM'.
    """
    if not date:
        return "—"
    return date.strftime("%d.%m.%Y, %H:%M")
