# encoding:utf-8
from __future__ import unicode_literals
from django.core.management.base import BaseCommand
from django.conf import settings
import requests
import json
from zhongbo.models import TBTaskBridge
from urllib.parse import urljoin

import logging
log = logging.getLogger('getcase')

if getattr(settings,'DEV_STATUS',None)=='dev':
    import wingdbstub


def get_token(): 
    appkey = 'yuanjingkey12345678910'
    yuanjing_url= settings.YUAN_JING
    url = urljoin(yuanjing_url,'/api?handler=token&key=%(appkey)s&method=getAccessToken' % {'appkey': appkey,} )
    rt = requests.get(url)
    dc = json.loads(rt.text)
    return dc.get('data').get('access_token')

def get_data(token,start,end): 
    access_token = get_token()
    url = urljoin(settings.YUAN_JING,"/api?access_token=%(access_token)s&handler=event&method=export" % {'access_token': token,} )
    # status='新增'
    # 'unit_code':'201805116508',
    data = {
        'project_id': '201804040003',
        'district':'201105290013',
        'send_time': start,#'2018-05-11',
        'to_time': end #'2018-05-12',
    }
    rt = requests.get(url, params = data)
    dc = json.loads(rt.text)
    return dc.get('data')
    #print(rt.content)

class Command(BaseCommand):
    """
    检查监督员的位置，判断其是否出界
    """
    def add_arguments(self, parser):
        parser.add_argument('mintime', nargs='?',)
        
    def handle(self, *args, **options):
        
        
        log.info('-' * 30)
        log.info('开始从远景系统导入数据')
        
        token = get_token()
        log.info('获取的token=%(token)s'%locals())
        start = ''
        end = '2018-06-10'
        case_list = get_data(token,start,end)
        
        count=0
        create_count=0
        for case in case_list:
            case_id = case.get('id') 
            dc={
                'yuan_eventNum':case.get('eventNum'),
                'yuan_photos':';'.join( [x.get('filePath') for x in  case.get('photos',[])]),
                'address':case.get('address'),
                'event_content':case.get('events').get('eventContent'),
                'yuan_occurredStr':case.get('occurredStr'),
                'yuan_status':case.get('status')
                
            }
            obj, created =TBTaskBridge.objects.update_or_create(yuan_id=case_id,defaults=dc)
            count+=1
            if created:
                create_count+=1



        log.info('抓取完成，共抓取了%s ; 新建%s' % (count,create_count) )
            
            
            
 
            
            
            

