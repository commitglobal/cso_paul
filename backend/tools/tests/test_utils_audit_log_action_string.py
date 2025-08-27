import unittest

from django.test import SimpleTestCase

from tools.utils.audit_log_action_string import get_action_string


class TestAuditLogActionString(SimpleTestCase):
    def test_known_actions_match_choices(self):
        # Import inside test to avoid hard-coding strings; assert function mirrors choices
        from auditlog.models import LogEntry

        for action in (
            LogEntry.Action.CREATE,
            LogEntry.Action.UPDATE,
            LogEntry.Action.DELETE,
            LogEntry.Action.ACCESS,
        ):
            self.assertEqual(get_action_string(action), str(LogEntry.Action.choices[action][1]))

    def test_unknown_action(self):
        # pick an out-of-range action id
        self.assertEqual(get_action_string(9999), "unknown_action!")


if __name__ == "__main__":
    unittest.main()
