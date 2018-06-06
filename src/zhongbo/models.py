from django.db import models

# Create your models here.
class TBTaskBridge(models.Model):
    yuan_id = models.IntegerField()
    yuan_photos = models.CharField(max_length = 1000)
    
    san_taskid = models.CharField(max_length = 30)
    address = models.CharField(max_length = 400)
    
    
    
