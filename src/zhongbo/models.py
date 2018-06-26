from django.contrib.gis.db import models

# Create your models here.

TASK_STATUS = (
    (0, '初始状态'),
    (1, '进入网格化'), 
    (2,'地址需要整理')
)

YUAN_STATUS=(
    (0,'新增'),
    (1,'回复'),
    (2,'通过'),
    (3,'退回'),
    (4,'挂起'),
    (6,'争议'),
    (7,'撤销'),
)

SAN_STATUS=(
    (0,'待受理'),
    (1,'待核实'),
    (2,'已上报核实'),
    (3,'待立案'),
    (4,'待派遣'),
    (5,'待催办'),
    (6,'待下发核查'),
    (7,'已下发核查'),
    (8,'待结案'),
    (9,'已结案'),
    (10,'已作废'),
    (11,'已退回其他平台'),
    (12,'待收集'),
    (13,'不受理'),
    (14,'已受理'),
    (15,'已立案'),
    (15,'已派遣')
)

DISTRICT=(
    (0,'徐泾'),
    (1,'赵巷'), 
    (2, '夏阳'), 
    (3, '朱家角')
)

class TBTaskBridge(models.Model):
    yuan_id = models.CharField(verbose_name= '远景ID',max_length=20)
    yuan_eventNum = models.CharField(verbose_name='远景任务号',max_length=20)
    yuan_photos = models.CharField(verbose_name = '远景图片', max_length = 1000)
    yuan_occurredStr=models.DateField(verbose_name='检查日期',max_length=20,null=True)
    yuan_status=models.IntegerField(verbose_name='远景系统状态',choices=YUAN_STATUS,default=0)
    san_taskid = models.CharField(verbose_name = '网格化任务号', max_length = 30,blank=True)
    san_remark = models.CharField(verbose_name = '网格化回复', max_length = 700,blank=True)
    
    address = models.CharField(verbose_name = '地址', max_length = 400)
    event_content = models.CharField(verbose_name = '事件内容', max_length=300)
    loc = models.PointField(verbose_name='经纬度',blank=True,null=True)
    
    district= models.IntegerField(verbose_name='区域',default=0,choices=DISTRICT)
    
    status=models.IntegerField(verbose_name='状态',default=0,choices=TASK_STATUS)
    san_status=models.IntegerField(verbose_name='网格化状态',default=0,choices=SAN_STATUS)
    create_time = models.DateTimeField(auto_now=True,verbose_name='导入时间')
    
    
    
    
    
