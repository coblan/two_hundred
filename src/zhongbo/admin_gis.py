from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,director,ModelFields,RowFilter,RowSort,PageNum,page_dc,director
from .models import TBTaskBridge
from helpers.maintenance.update_static_timestamp import js_stamp_dc

class GisPage(TablePage):
    template='zhongbo/scatter.html'
    
    def get_label(self): 
        return 'GIS散点图'
    
    class tableCls(ModelTable):
        model=TBTaskBridge
        exclude = []
        class pagenator(PageNum):
            def get_query(self, query):
                return query
            def get_context(self):
                return {
                    'crt_page':1,
                    'total':1,
                    'perpage':1
                } 
            
            

director.update({
    'scatter':GisPage.tableCls,
})
  
page_dc.update({
    'scatter':GisPage
})
        
        
    