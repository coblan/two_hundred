# encoding:utf-8

from __future__ import unicode_literals
from helpers.director.shortcut import page_dc
from helpers.director.engine import BaseEngine,page,fa,can_list,can_touch
from django.contrib.auth.models import User,Group
from helpers.func.collection.container import evalue_container
from helpers.maintenance.update_static_timestamp import js_stamp
from django.utils.translation import ugettext as _
from django.conf import settings
from . import permit_menu

from zhongbo.models import TBTaskBridge


class PcMenu(BaseEngine):
    url_name='webpage'
    brand = '中博会对接系统'
    mini_brand='中博'

    @property
    def menu(self):
        crt_user = self.request.user
        menu=[
            {'label':'主页','url':page('home'),'icon':fa('fa-home'), 'visible':True}, 
            {'label':'案件管理','icon':fa('fa-truck'),'visible':True,
            'submenu':[
                {'label':'案件列表','url':page('taskpage'), 'visible': can_touch(TBTaskBridge, crt_user),},
                {'label':'excel','url':page('onexcel'), 'visible': can_touch(TBTaskBridge, crt_user),},
                ]},              
            
            
            {'label':'案件统计','icon':fa('fa-bar-chart'),'visible':True,
            'submenu':[ 
                {'label':'案件状态','url':page('district_pie'), 'visible': can_touch(TBTaskBridge, crt_user),},
                {'label':'案件走势','url':page('timetask_bar'), 'visible': can_touch(TBTaskBridge, crt_user),},
                #{'label':_('Tb Login Log'),'url':page('maindb.loginlog'), 'visible': can_touch(TbLoginlog, crt_user),},
                           ]}, 
            
 
            {'label':'GIS分析','icon':fa('fa-map-marker'),'visible':True,
            'submenu':[
                {'label':'散点图','url':page('scatter'), 'visible': can_touch(TBTaskBridge, crt_user),},
                #{'label':_('Tb Login Log'),'url':page('maindb.loginlog'), 'visible': can_touch(TbLoginlog, crt_user),},
                            ]},  
            
            
             {'label':_('User'),'icon':fa('fa-user'),'visible':True,
                  'submenu':[
                      {'label':_('User'),'url':page('jb_user'),'visible':can_touch(User, crt_user)},
                      {'label':_('Role'),'url':page('jb_group'),'visible':can_touch(Group, crt_user)},
                      #{'label':'权限分组','url':page('group_human'),'visible':can_touch(Group)},
                ]},        
            
        ]
        
        return menu

    
    def custome_ctx(self, ctx):
        ctx['js_stamp']=js_stamp
        ctx['fast_config_panel']=True

        return ctx      

PcMenu.add_pages(page_dc)

#class ProgramerAdmin(BaseEngine):
    #url_name='ProgramerAdmin'
    #brand = 'ProgramerAdmin'
    #mini_brand='PA'
 
    #@property
    #def menu(self):
        #menu=[
            #{'label':_('DashBoard'),'url':page('home'),'icon':fa('fa-home')},
            #{'label':'账号','url':page('user'),'icon':fa('fa-users'),'visible':can_list((User,Group)),
                 #'submenu':[
                     #{'label':'账号管理','url':page('jb_user'),'visible':can_touch(User)},
                     #{'label':'角色管理','url':page('jb_group'),'visible':can_touch(Group)},
                     #{'label':'权限分组','url':page('group_human'),'visible':can_touch(Group)},
                #]},   
            #]
        #return menu
    
    #def custome_ctx(self, ctx):
        #ctx['js_stamp']=js_stamp
        #ctx['fast_config_panel']=True
        #return ctx    
    
#ProgramerAdmin.add_pages(page_dc)
    
