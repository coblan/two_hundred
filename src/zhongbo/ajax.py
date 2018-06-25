# encoding:utf-8
from .sangao_port import put_task_to_sangao, LocConverError
from .models import TBTaskBridge

def get_global():
    return globals()

def putIntoSangao(pk):
    """
    测试导入的第一个taskid =1806B1600991
    """
    task = TBTaskBridge.objects.get(pk=pk)
    images=task.yuan_photos.split(';')
    try:
        taskid = put_task_to_sangao(images, task.address, task.event_content)
        task.san_taskid=taskid
    except LocConverError as e:
        taskid = ''
        task.status = 2
    task.save()
    return {'status':'success', 'row': {'taskid':taskid, 'status': task.status}}
    
