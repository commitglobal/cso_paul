from datetime import datetime


def short_date(date: datetime) -> str:
    """
    Returns a short date string in the format 'DD.MM.YYYY'.
    """
    return date.strftime("%d.%m.%Y")


def short_datetime(date: datetime) -> str:
    """
    Returns a short datetime string in the format 'DD.MM.YYYY, HH:MM'.
    """
    return date.strftime("%d.%m.%Y, %H:%M")
