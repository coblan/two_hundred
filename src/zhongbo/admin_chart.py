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
                        {'value':30, 'name':'待受理', 'selected':True},
                        {'value':25, 'name':'待核实'},
                        {'value':18, 'name':'待派遣'},
                        {'value':33,'name':'待结案'},
                        {'value':25,'name':'已结案'}
                    ],
                    'data2':[
                        {'value':11, 'name':'徐泾'},
                        {'value':8, 'name':'赵巷'},
                        {'value':7, 'name':'朱家角'},
                        {'value':4, 'name':'夏阳'},
                        
                        {'value':2, 'name':'徐泾'},
                        {'value':6, 'name':'赵巷'},
                        {'value':6, 'name':'朱家角'},
                        {'value':11, 'name':'夏阳'},
                        
                       
                        {'value':4, 'name':'徐泾'},
                        {'value':7, 'name':'赵巷'} ,
                         {'value':7, 'name':'夏阳'},
                        
                        {'value':18, 'name':'徐泾'},
                        {'value':7, 'name':'赵巷'},
                        {'value':8, 'name':'朱家角'},
                        
                         {'value':2, 'name':'徐泾'},
                        {'value':6, 'name':'赵巷'},
                        {'value':6, 'name':'朱家角'},
                        {'value':11, 'name':'夏阳'},
                    ]
                }
                
            }
            

class TimeTaskBar(FieldsPage):
    template='zhongbo/timetask_bar.html'
    
    def get_label(self):
        return '条状图'
    class fieldsCls(ModelFields):
        class Meta:
            model=TBTaskBridge
            exclude=[]
            
        def get_context(self):
            return {
                'bar_data':{
                    'kind':['立面三乱','黄土见天','暴露垃圾','河滩垃圾','其他'],
                    'month':['2018-01','2018-02','2018-03','2018-04','2018-05','2018-06'],
                    'series':[ [5,6,7,4,6,4], [8,2,4,5,1,2], [2,3,2,1,0,4], [1,4,5,2,1,4],[5,2,3,6,4,3]]
                }
            }


director.update({
    'district_pie':DistrictPie.fieldsCls,
    'timetask_bar':TimeTaskBar.fieldsCls
})
  
page_dc.update({
    'district_pie':DistrictPie,
    'timetask_bar':TimeTaskBar
})
        
        
