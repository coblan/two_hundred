from django.db import models

# Create your models here.
class TBTaskBridge(models.Model):
    yuan_id = models.IntegerField()
    yuan_photos = models.CharField(max_length = 1000)
    
    san_taskid = models.CharField(max_length = 30)
    address = models.CharField(max_length = 400)
    event_content = models.CharField(max_length=300)
    status=models.IntegerField(verbose_name='状态',default=0)
    create_time = models.DateTimeField(auto_now=True)
    
    
    
    
    
