from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,director,ModelFields,RowFilter,RowSort,RowSearch
from .models import TBTaskBridge
from helpers.maintenance.update_static_timestamp import js_stamp_dc
from . import admin_gis
from . import admin_chart
from .sangao_port import addrToPoint, LocConverError
# Register your models here.
class TaskPage(TablePage):
    template='jb_admin/table.html'
    extra_js=['/static/js/zhongbo.pack.js?t=%s'%js_stamp_dc.get('zhongbo_pack_js','')]
    
    def get_label(self):
        return '案件列表'
    
    class tableCls(ModelTable):
        """
        三高task地址: http://10.231.18.25/CityGrid/CaseOperate_flat/ParticularDisplayInfo.aspx?categoryId=undefined&taskid=1806B1651274
        """
        model=TBTaskBridge
        exclude=[]
        pop_edit_field='detail'
        fields_sort=['yuan_eventNum','san_taskid','yuan_occurredStr','address','event_content', 'status','yuan_status', 'san_status',
                     'san_remark', 'create_time','loc','detail']
        def get_operation(self):
            opes = super().get_operation()
            ls = [
                {'fun': 'updateFromYuan', 'editor': 'com-op-btn', 'label': '从远景系统更新案件', 'icon': 'fa-handshake-o',}, 
                {'fun':'putTaskIntoSangao','editor':'com-op-btn','label':'导入网格化系统','style': 'color:green','icon': 'fa-handshake-o','disabled':'!has_select'},
                {'fun': 'updateFromSan', 'editor': 'com-op-btn', 'label': '从网格化更新案件', 'icon': 'fa-handshake-o','disabled':'!has_select'}, 
                {'fun': 'taskToYuanjing', 'editor': 'com-op-btn', 'label': '反馈回远景系统', 'icon': 'fa-handshake-o','disabled':'!has_select'}
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
                'san_taskid': 110,
                'address':150,
                'event_content':150,
            }
            head['width']=dc.get(head['name'],100)
            if head['name'] == 'san_taskid':
                head['editor'] = 'com-table-jump-link'
                head['link_field'] = '_sangao_link'
            return head
        
        def dict_row(self, inst): 
            return {
                '_sangao_link': 'http://10.231.18.25/CityGrid/CaseOperate_flat/ParticularDisplayInfo.aspx?categoryId=undefined&taskid=' + inst.san_taskid,
            }
        
        def inn_filter(self, query):
            return query.order_by('-pk')
            #return query.order_by('-yuan_occurredStr')
        
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
        
        class search(RowSearch):
            names=['yuan_eventNum']

class TaskForm(ModelFields):
    class Meta:
        model=TBTaskBridge
        exclude=[]
    
    def clean(self): 
        super().clean()
        if 'address' in self.changed_data:
            try:
                self.cleaned_data['loc'] = addrToPoint(self.cleaned_data.get('address'))
            except LocConverError:
                self.cleaned_data['status'] = 2
           
        
    

director.update({
    'taskpage':TaskPage.tableCls,
    'taskpage.edit':TaskForm
})

page_dc.update({
    'taskpage':TaskPage
})