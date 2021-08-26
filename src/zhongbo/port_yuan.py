# encoding:utf-8

import requests
import json
import base64
from django.conf import settings
from django.utils.timezone import datetime, timedelta
from .models import TBTaskBridge
import logging
log = logging.getLogger('getcase')

proxies =  getattr(settings, 'DATA_PROXY','')

def updateCase(): 

    log.info('开始从远景系统导入数据')
   
    token = get_token()
    log.info('获取的token=%(token)s'%locals())
    now = datetime.now()
    day_360_ago = now - timedelta(days = 360)
    start = day_360_ago.strftime('%Y-%m-%d')
    end = now.strftime('%Y-%m-%d')
    case_list = get_data(token,start,end)
   
    dbCaseIds = [row.yuan_id for row in TBTaskBridge.objects.all()]
    insertCases = []
    for case in case_list:
        case_id = case.get('id') 
        if case_id in dbCaseIds:
            continue
        
        dc={
            'yuan_id': case.get('id') ,
            'yuan_eventNum':case.get('eventNum'),
            'yuan_photos':';'.join( [x.get('filePath') for x in  case.get('photos',[])]),
            'address':case.get('address'),
            'event_content':case.get('events').get('eventContent'),
            'yuan_occurredStr':case.get('occurredStr'),
            'yuan_status':case.get('status')
        }
        insertCases.append(TBTaskBridge(**dc))
        #obj, created =TBTaskBridge.objects.update_or_create(yuan_id=case_id,defaults=dc)
        #count+=1
    TBTaskBridge.objects.bulk_create(insertCases)
    
    count= len(case_list) 
    create_count = len(insertCases)
    log.info('抓取完成，共抓取了%s ; 新建%s' % (count,create_count) )
    return create_count


def get_token(): 
    appkey = 'yuanjingkey12345678910'
    url = settings.YUAN_JING+'/api?handler=token&key=%(appkey)s&method=getAccessToken' % {'appkey': appkey,}
    log.debug('开始获取token url=%s'%url)
    rt = requests.get(url)
    log.debug('返回结果:%s'%rt.text)
    dc = rt.json()
    return dc.get('data').get('access_token')

def get_data(token,start,end): 
    #access_token = get_token()
    url = settings.YUAN_JING+"/api?access_token=%(access_token)s&handler=event&method=export" % {'access_token': token,} 
    # status='新增'
    # 'unit_code':'201805116508',
    data = {
        # 'project_id': '202005140001', # '201902120006', #'201804040003',
        # 2021/8/26 修改
        'project_id': '202103230001',
        'district':'201105290013',
        'send_time': start,#'2018-05-11',
        'to_time': end #'2018-05-12',
    }
    log.debug('开始请求数据api,url:%s，参数为:%s'%(url,data))
    rt = requests.get(url, params = data)
    log.debug('请求结束，返回结果为:%s'%rt.text)
    dc = json.loads(rt.text)
    ls1 = dc.get('data')
    
    ## 请求额外的一个项目 // 暂时屏蔽
    #data2 ={
        #'project_id': '201804040001', 
        #'district':'201105290013',
        #'send_time': start,
        #'to_time': end ,
    #}
    #rt2 = requests.get(url, params = data2)
    #dc2 = rt2.json()
    #ls2 = dc2.get('data')
    #ls = ls1 + ls2
    ls = ls1
    return ls
    #print(rt.content)

def submitTaskToYuan(bridge_items): 
    #data = [{
        #'taskid': '201805101289',
        #'remark': '测试用',
        #'pictures': [p1],
        #}, 
        #{'taskid': '201805101290',
         #'remark': '测试用',
         #'pictures': [p2],}
        #]
    log.info('提交任务回远景系统')
    data = []
    for item in  bridge_items:
        data.append({
            'taskid': item.yuan_id,
            'remark': item.san_remark,
            'pictures': [base64Image(imgUrl) for imgUrl in item.san_image.split(';') if imgUrl],
        })
    access_token = get_token()
    url = settings.YUAN_JING+'/api?handler=event&method=import&access_token=%(access_token)s' % {'access_token': access_token,}
    rt = requests.post(url, data = {'data': json.dumps( data)})
    #print(rt.content)
    log.info('提交结束')

def base64Image(imgUrl): 
    rt = requests.get(imgUrl, proxies = proxies)
    encoded_string = base64.b64encode(rt.content).decode('utf-8')
    base64Data = 'data:image/jpeg;base64,%(data)s' % {'data': encoded_string,}
    return base64Data
    #with open(r"C:\Users\heyul\Desktop\jj20180512141450.jpg", "rb") as image_file:
        #encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    #p1 = 'data:image/jpeg;base64,%(data)s' % {'data': encoded_string,}
    #with open(r"C:\Users\heyul\Desktop\jj20180512140349.jpg", "rb") as image_file:
        #encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        #p2 = 'data:image/jpeg;base64,%(data)s' % {'data': encoded_string,}  


