from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,director,ModelFields
from .models import TBTaskBridge

# Register your models here.
class TaskPage(TablePage):
    template='jb_admin/table.html'
    def get_label(self):
        return '案件列表'
    
    class tableCls(ModelTable):
        model=TBTaskBridge
        exclude=[]

class TaskForm(ModelFields):
    class Meta:
        model=TBTaskBridge
        exclude=[]

director.update({
    'taskpage':TaskPage.tableCls,
    'taskpage.edit':TaskForm
})

page_dc.update({
    'taskpage':TaskPage
})