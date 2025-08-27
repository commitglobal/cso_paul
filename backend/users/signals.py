import logging
from typing import Dict, List

from auditlog.models import LogEntry
from django.db.models.base import ModelBase

from tools.utils.audit_log_action_string import get_action_string

logger = logging.getLogger(__name__)


def auditlog_to_output(action: int, changes: Dict, instance, log_entry: LogEntry, sender: ModelBase, **kwargs):
    action_string: str = get_action_string(action_id=action)

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
