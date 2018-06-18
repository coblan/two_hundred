from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,director,ModelFields,RowFilter,RowSort
from .models import TBTaskBridge
from helpers.maintenance.update_static_timestamp import js_stamp_dc

# Register your models here.
class TaskPage(TablePage):
    template='jb_admin/table.html'
    extra_js=['/static/js/zhongbo.pack.js?t=%s'%js_stamp_dc.get('zhongbo_pack_js','')]
    
    def get_label(self):
        return '案件列表'
    
    class tableCls(ModelTable):
        model=TBTaskBridge
        exclude=[]
        pop_edit_field='detail'
        fields_sort=['yuan_eventNum','san_taskid','yuan_occurredStr','yuan_status','status','address','event_content','create_time','detail']
        def get_operation(self):
            opes = super().get_operation()
            ls = [
                {'name':'putTaskIntoSangao','editor':'com-op-btn','label':'导入网格系统','style': 'color:green','icon': 'fa-handshake-o','disabled':'!has_select'},
               ]
            opes.extend(ls)
            return opes
        
        def getExtraHead(self):
            return [{
                'name':'detail',
                'label':'',
                'show_label':{
                    'fun':'text_label',
                    'text':'详情' 
                }
            }]

      
        def dict_head(self, head):
            dc={
                'yuan_eventNum':120,
                'address':150,
                'event_content':150,
            }
            head['width']=dc.get(head['name'],100)
            return head
        
        def inn_filter(self, query):
            return query.order_by('-yuan_occurredStr')
        
        def get_context(self):
            ctx = ModelTable.get_context(self)
            ctx['extra_table_logic'] = 'zhongbo_logic'
            return ctx
        
        class filters(RowFilter):
            model=TBTaskBridge
            names=['yuan_status']
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