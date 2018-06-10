from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,director,ModelFields,RowFilter,RowSort
from .models import TBTaskBridge

# Register your models here.
class TaskPage(TablePage):
    template='jb_admin/table.html'
    def get_label(self):
        return '案件列表'
    
    class tableCls(ModelTable):
        model=TBTaskBridge
        exclude=[]
        fields_sort=['yuan_eventNum','san_taskid','yuan_occurredStr','address','event_content','create_time']
        def get_operation(self):
            return [
                {'name':'import_case','editor':'com-op-btn','label':'导入网格系统','style': 'color:green','icon': 'fa-handshake-o','disabled':'!has_select'},
               ]
        
        def inn_filter(self, query):
            return query.order_by('-yuan_occurredStr')
        
        class filters(RowFilter):
            model=TBTaskBridge
            range_fields=['yuan_occurredStr']
        class sort(RowSort):
            names=['yuan_occurredStr']

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