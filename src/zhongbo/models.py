from django.db import models

# Create your models here.

TASK_STATUS = (
    (0, '初始状态'),
    (1, '进入网格化'), 
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

class TBTaskBridge(models.Model):
    yuan_id = models.CharField(verbose_name= '远景ID',max_length=20)
    yuan_eventNum = models.CharField(verbose_name='远景任务号',max_length=20)
    yuan_photos = models.CharField(verbose_name = '远景图片', max_length = 1000)
    yuan_occurredStr=models.DateField(verbose_name='检查日期',max_length=20,null=True)
    yuan_status=models.IntegerField(verbose_name='远景系统状态',choices=YUAN_STATUS,default=0)
    san_taskid = models.CharField(verbose_name = '三高taskid', max_length = 30)
    address = models.CharField(verbose_name = '地址', max_length = 400)
    event_content = models.CharField(verbose_name = '事件内容', max_length=300)
    
    status=models.IntegerField(verbose_name='状态',default=0,choices=TASK_STATUS)
    create_time = models.DateTimeField(auto_now=True,verbose_name='导入时间')
    
    
    
    
    
