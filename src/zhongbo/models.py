from django.db import models

# Create your models here.

TASK_STATUS = (
    (0, '初始状态'),
    (1, '进入网格化'), 
    
)

class TBTaskBridge(models.Model):
    yuan_id = models.IntegerField(verbose_name= '远景ID')
    yuan_photos = models.CharField(verbose_name = '远景图片', max_length = 1000)
    
    san_taskid = models.CharField(verbose_name = '三高taskid', max_length = 30)
    address = models.CharField(verbose_name = '地址', max_length = 400)
    event_content = models.CharField(verbose_name = '时间内容', max_length=300)
    
    status=models.IntegerField(verbose_name='状态',default=0)
    create_time = models.DateTimeField(auto_now=True)
    
    
    
    
    
