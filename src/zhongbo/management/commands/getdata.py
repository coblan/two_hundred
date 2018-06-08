# encoding:utf-8
from __future__ import unicode_literals
from django.core.management.base import BaseCommand
from django.conf import settings
import requests
import json
from zhongbo.models import TBTaskBridge
from urllib.parse import urljoin

import logging
log = logging.getLogger('getdata')

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
    # 
    data = {
        'project_id': '201804040003',
        'send_time': start,#'2018-05-11',
        'to_time': end #'2018-05-12',
    }
    rt = requests.get(url, params = data)
    dc = json.loads(rt.text)
    print(rt.content)

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
        start = '2018-05-11'
        end = '2018-05-12'
        dc = get_data(token,start,end)
        
        #spd = DuchaCaseSpider()
        mover = DuchaPort()
        ls =[]
        count = 0
        for row in mover.get_data():
            count += 1
            #subtime = row[7]
            #if mintime !='all' and subtime <mintime:
                #return
            time_prefix =  '/'.join( [str( int(x) )for x in row['discovertime'].split('-')] )
            imagefilename = row['imagefilename']
            image_list = imagefilename.split(',')
            image_list = ["http://10.231.18.4/Mediainfo/18/%s/%s" % (time_prefix , x)for x in image_list]
            
            taskid = row['taskid']
            loc_x,loc_y = cord2loc(float( row.get('coordx') ),float( row.get('coordy') ))
            data_dc={
                'taskid':taskid,
                'subtime':row['discovertime'],
                'bigclass':row['bcname'],
                'litclass':row['scname'],
                'addr':row['address'],
                'loc':Point(x=loc_x,y=loc_y),
                'pic':json.dumps( image_list ),
  
            }
            ls.append(DuchaCase(**data_dc))
            
            #DuchaCase.objects.update_or_create(taskid=taskid,default=dft)
            #obj , _ = DuchaCase.objects.get_or_create(taskid=taskid)
            #obj.subtime=row[7]
            #obj.bigclass = row[4]
            #obj.litclass=row[5]
            #obj.addr=row[8]
            
            #obj.KEY=row[-2]
            #dc = row[-1]
            #loc_x,loc_y = cord2loc(float( dc.get('x') ),float( dc.get('y') ))
            #obj.loc=Point(x=loc_x,y=loc_y)
            #pic = [x['src'] for x in json.loads(dc.get('pic'))]
            #obj.pic= json.dumps(pic)
            #audio = [x['src'] for x in json.loads(dc.get('audio'))]
            #obj.audio= json.dumps(audio)
        DuchaCase.objects.bulk_create(ls)
        log.info('抓取完成，共抓取了%s' % count)
            
            
            
 
            
            
            

