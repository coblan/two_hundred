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
        pop_edit_field='detail'
        fields_sort=['yuan_eventNum','san_taskid','yuan_occurredStr','yuan_status','status','address','event_content','create_time','detail']
        def get_operation(self):
            opes = super().get_operation()
            ls = [
                {'name':'import_case','editor':'com-op-btn','label':'导入网格系统','style': 'color:green','icon': 'fa-handshake-o','disabled':'!has_select'},
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
            #return [{'name':'detail',
                    #'label':'',
                    #'editor':'com-table-pop-fields',
                    #'fields_ctx':TaskForm(crt_user=self.crt_user).get_head_context(),
                    #'show_label':{
                        #'fun':'text_label',
                        #'text':'详情'
                    #},

                    #'get_row':{
                        #'fun':'get_with_relat_field',
                        #'kws':{
                           #'director_name':TaskForm.get_director_name(),
                           #'relat_field':'pk',              
                        #}                        
                    #},
                    ##'fun':'use_table_row',
                    #'width':60,
                     #}]
            #return [{'name':'detail',
                    #'label':'',
                    #'editor':'com-table-extraclick',
                    #'extra_label':'详情',
                    #'get_data':{
                        #'fun':'get_row',
                        #'kws':{
                           #'director_name':TaskForm.get_director_name(),
                           #'relat_field':'pk',              
                        #}                        
                    #},
                    #'fun':'use_table_row',
                    #'width':60,
                          #}]
        
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