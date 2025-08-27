from auditlog.models import LogEntry


def get_action_string(action_id: int) -> str:
    valid_actions = (
        LogEntry.Action.CREATE,
        LogEntry.Action.UPDATE,
        LogEntry.Action.DELETE,
        LogEntry.Action.ACCESS,
    )

    if action_id in valid_actions:
        return str(LogEntry.Action.choices[action_id][1])

    return "unknown_action!"
