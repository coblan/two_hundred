from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,director,ModelFields,RowFilter,\
     RowSort,PageNum,page_dc,director,FieldsPage,ModelFields
from .models import TBTaskBridge
from helpers.maintenance.update_static_timestamp import js_stamp_dc

"""
堆叠柱状图
http://echarts.baidu.com/examples/editor.html?c=bar-y-category-stack
"""

class DistrictPie(FieldsPage):
    template='zhongbo/district_pie.html'
    
    def get_label(self): 
        return '区域按键状态统计'
    
    class fieldsCls(ModelFields):
        class Meta:
            model=TBTaskBridge
            exclude = []
        
        
        def get_context(self):
            return {
                'pie_data':{
                    'total_name':['待受理','待核实','待派遣','待结案','已结案'],
                    'data1':[ 
                        {'value':335, 'name':'待受理', 'selected':True},
                        {'value':679, 'name':'待核实'},
                        {'value':1000, 'name':'待派遣'},
                        {'value':548,'name':'待结案'},
                        {'value':500,'name':'已结案'}
                    ],
                    'data2':[
                        {'value':335, 'name':'徐津'},
                        {'value':310, 'name':'赵巷'},
                        {'value':234, 'name':'朱家角'},
                        {'value':135, 'name':'夏阳'},
                        
                        {'value':48, 'name':'徐津'},
                        {'value':500, 'name':'赵巷'},
                        {'value':500, 'name':'朱家角'},
                        
                        {'value':251, 'name':'夏阳'},
                        {'value':147, 'name':'徐津'},
                        {'value':102, 'name':'赵巷'}                        
                    ]
                }
                
            }
            

director.update({
    'district_pie':DistrictPie.fieldsCls,
})
  
page_dc.update({
    'district_pie':DistrictPie
})
        
        
