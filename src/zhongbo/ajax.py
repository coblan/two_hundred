# encoding:utf-8
from .sangao_port import put_task_to_sangao
from .models import TBTaskBridge

def get_global():
    return globals()

def putIntoSangao(pk):
    """
    测试导入的第一个taskid =1806B1600991
    """
    task = TBTaskBridge.objects.get(pk=pk)
    images=task.yuan_photos.split(';')
    taskid = put_task_to_sangao(images, task.address, task.event_content)
    task.san_taskid=taskid
    task.save()
    return {'status':'success','taskid':taskid}
    
