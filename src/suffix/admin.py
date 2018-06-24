from django.contrib import admin
from helpers.director.shortcut import FieldsPage,ModelFields,page_dc
# Register your models here.
class OneExcel(FieldsPage):
    template='suffix/onexcel.html'
    def get_label(self):
        return 'EXCEL'

page_dc.update({
    'onexcel':OneExcel
})