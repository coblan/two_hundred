from django.contrib import admin
from helpers.director.shortcut import FieldsPage,ModelFields
# Register your models here.
class OneExcel(FieldsPage):
    template='suffix/onexcel.html'
    class fieldsCls(ModelFields):
        def get_row(self):
            return []