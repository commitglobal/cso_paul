import logging
from typing import Dict, List

from auditlog.models import LogEntry
from django.db.models.base import ModelBase

logger = logging.getLogger(__name__)


def auditlog_to_output(action: int, changes: Dict, instance, log_entry: LogEntry, sender: ModelBase, **kwargs):
    action_string: str = str(
        LogEntry.Action.choices[action][1]
        if action
        in (
            LogEntry.Action.CREATE,
            LogEntry.Action.UPDATE,
            LogEntry.Action.DELETE,
            LogEntry.Action.ACCESS,
        )
        else "unknown_action!"
    )

    instance_pk: str = "#" + str(instance.pk if instance else None)
    changes: List[str] = list(changes.keys()) if changes else []

    logger.info(
        "[AUDITLOG] ADDRESS: <%s> | ACTOR: <%s> | ACTION: <%s> | SENDER: <%s> | PK: <%s> | CHANGES: <%s>",
        log_entry.remote_addr if (log_entry and log_entry.remote_addr) else "0.0.0.0",
        log_entry.actor if (log_entry and log_entry.actor) else "system!",
        action_string,
        sender,
        instance_pk,
        changes,  # only output the changed field names
    )
