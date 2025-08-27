class CommonLabelValueChoices:
    choices = []

    @classmethod
    def label_value_choices(cls):
        return [{"label": label, "value": value} for value, label in cls.choices]

    @classmethod
    def filtered_label_value_choices(cls, filter_values):
        return [{"label": label, "value": value} for value, label in cls.choices if value in filter_values]
