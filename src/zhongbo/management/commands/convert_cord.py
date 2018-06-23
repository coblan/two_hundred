# encoding:utf-8
from __future__ import unicode_literals

from django.conf import settings
if getattr(settings,'DEV_STATUS',None)=='dev':
    import wingdbstub
    
from django.core.management.base import BaseCommand

import requests
import json
from zhongbo.models import TBTaskBridge
from urllib.parse import urljoin
from django.contrib.gis.geos import Point
import logging
log = logging.getLogger('conver_cord')



from zhongbo.sangao_port import address_2_info
from helpers.case.gisapp.sangao.cord_convert import cord2loc

class Command(BaseCommand):
    """
    """
    #def add_arguments(self, parser):
        #parser.add_argument('mintime', nargs='?',)
        
    def handle(self, *args, **options):
        
        
        log.info('-' * 30)
        log.info('转换坐标')
        
        count=0
        for task in TBTaskBridge.objects.filter(loc__isnull=True):
            dc = address_2_info(task.address)
            if dc['hdn_X']=='0' and dc['hdn_Y']=='0':
                task.status=2
            else:
                loc_x,loc_y = cord2loc( float( dc['hdn_X']), float( dc['hdn_Y']) )
                task.loc = Point(x=loc_x,y=loc_y)
                count+=1
            print(task.yuan_eventNum)
            task.save()
           


        log.info('转换了%s 个' % count )
            
            
            
 
            
            
            

