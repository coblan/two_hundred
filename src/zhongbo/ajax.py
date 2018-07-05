# encoding:utf-8
from .sangao_port import put_task_to_sangao, LocConverError
from .models import TBTaskBridge
from .port_yuan import submitTaskToYuan, updateCase
from .sangao_port import updateTask
import logging
log = logging.getLogger('export_to_sangao')

def get_global():
    return globals()

def updateFromSan(taskids): 
    return updateTask(taskids)

def updateFromYuan(): 
    count = updateCase()
    return {'status': 'success','count':count}

def putIntoSangao(pk):
    """
    测试导入的第一个taskid =1806B1600991
    """
    log.info('开始上传三高，案件bridge ID: %s' % pk)
    task = TBTaskBridge.objects.get(pk=pk)
    images=task.yuan_photos.split(';')
    try:
        taskid = put_task_to_sangao(images, task.address, task.event_content)
        task.san_taskid=taskid
    except LocConverError as e:
        taskid = ''
        task.status = 2
    task.save()
    log.info('结束本次上传 ID :%s' % pk)
    return {'status':'success', 'row': {'taskid':taskid, 'status': task.status}}

def taskToYuanjing(pks): 
    tasks = TBTaskBridge.objects.filter(pk__in = pks)
    submitTaskToYuan(tasks)
    return {'status': 'success',}
    
