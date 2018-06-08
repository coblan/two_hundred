# encoding:utf-8

from __future__ import unicode_literals
from helpers.director.shortcut import page_dc
from helpers.director.engine import BaseEngine,page,fa,can_list,can_touch
from django.contrib.auth.models import User,Group
from helpers.func.collection.container import evalue_container
from helpers.maintenance.update_static_timestamp import js_stamp
from django.utils.translation import ugettext as _
from django.conf import settings
from .js_translation import get_tr
from zhongbo.models import TBTaskBridge


class PcMenu(BaseEngine):
    url_name='webpage'
    brand = '200'
    mini_brand='200'

    @property
    def menu(self):
        crt_user = self.request.user
        menu=[
            {'label':_('DashBoard'),'url':page('home'),'icon':fa('fa-home'), 'visible':True}, 
            
            {'label':_('Marketing'),'icon':fa('fa-image'), 'visible': True,
            'submenu':[
                {'label':_('Banner'),'url':page('TbBanner'), 'visible': can_touch(TbBanner, crt_user) },
                {'label':_('App Package'),'url':page('maindb.TbAppversion'), 'visible': can_touch(TbAppversion, crt_user),},
                {'label':_('Notice'),'url':page('maindb.TbNotice'), 'visible': can_touch(TbNotice, crt_user),},
                {'label':_('Currency'),'url':page('maindb.TbCurrency'), 'visible': can_touch(TbCurrency, crt_user)},
                {'label':_('Help'),'url':page('maindb.TbQa'), 'visible': can_touch(TbQa, crt_user),},
                {'label':_('Activity'),'url':page('maindb.TBActive'), 'visible': can_touch(TbActivity, crt_user),},
                {'label':_('AppResource'),'url':page('AppResource'), 'visible': can_touch(TbAppresource, crt_user),},
                ]},  
            
            
            {'label':_('Member'),'icon':fa('fa-users'),'visible':True,
            'submenu':[
                {'label':_('Tb Account'),'url':page('maindb.account'), 'visible': can_touch(TbAccount, crt_user),},
                {'label':_('Tb Login Log'),'url':page('maindb.loginlog'), 'visible': can_touch(TbLoginlog, crt_user),},
                
                ]},   
            
            {'label':_('MoneyFlow'),'icon':fa('fa-dollar'),'visible':True,
            'submenu':[
                {'label':_('Tb Balance Log'),'url':page('maindb.balancelog'), 'visible': can_touch(TbBalancelog, crt_user),},
                {'label':_('Charge Flow'),'url':page('ChargeFlow'), 'visible': can_touch(TbChargeflow, crt_user),},
                #{'label':_('Tb Trans'),'url':page('maindb.trans'),'icon':fa('fa-home')},
                {'label':_('Tb Channel'),'url':page('maindb.channel'), 'visible': can_touch(TbChannel, crt_user),},
                             ]}, 
            
            {'label':_('Games'),'icon':fa('fa-globe'),'visible':True,
            'submenu':[
                {'label':_('Tb TicketMaster'),'url':page('maindb.ticketmaster'), 'visible': can_touch(TbTicketmaster, crt_user),},
                {'label':_('Tb Match'),'url':page('maindb.Matches'), 'visible': can_touch(TbMatches, crt_user),},
                {'label':_('View TicketSingleByMatch'),'url':page('maindb.TicketSingleByMatch'), 'visible': can_touch(TbMatches, crt_user),},
                {'label':_('Odds'),'url':page('maindb.TbOdds'), 'visible': True,},
                #{'label':'Players','url':page('betradar.Players'),'icon':fa('fa-home')},
                        ]}, 
            
            {'label':_('RiskControl'),'icon':fa('fa-lock'),'visible':True,
            'submenu':[
                {'label':_('Tb RC Filter'),'url':page('maindb.TbRcFilter'), 'visible': can_touch(TbRcFilter, crt_user),},
                {'label':_('Tb RC Level'),'url':page('maindb.TbRcLevel'), 'visible': can_touch(TbRcLevel, crt_user),},
                {'label':_('Tb RC User'),'url':page('maindb.TbRcUser'), 'visible': can_touch(TbRcUser, crt_user),},
                {'label':_('Tb Blankuserlist'),'url':page('maindb.TbBlackuserlist'), 'visible': can_touch(TbBlackuserlist, crt_user),},
                {'label':_('Tb BlackuserlistLog'),'url':page('maindb.TbBlackuserlistLog'), 'visible': can_touch(TbBlackuserlistLog, crt_user),},
                
                {'label':_('Black IP Range'),'url':page('maindb.BlankipRangeList'), 'visible': can_touch(Blackiprangelist, crt_user),},
                {'label':_('White IP'),'url':page('maindb.WhiteIpList'), 'visible': can_touch(Whiteiplist, crt_user),},
                {'label':_('White User'),'url':page('maindb.Whiteuserlist'), 'visible': can_touch(Whiteuserlist, crt_user),},
                
                {'label':_('Tb Withdraw Limit Log'),'url':page('maindb.TbWithdrawlimitlog'), 'visible': can_touch(TbWithdrawlimitlog, crt_user)}
                        ]},             
            
            
            {'label':_('Report'),'icon':fa('fa-bar-chart'),'visible':True,
            'submenu':[
                {'label':_('Channel'),'url':page('maindb.report.channel'), 'visible': can_touch(TbChannel, crt_user),},
                {'label':_('Account'),'url':page('maindb.report.account'), 'visible': can_touch(TbAccount, crt_user),},
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
        #ctx['table_fun_config'] ={
            #'detail_link': '详情', #'<i class="fa fa-info-circle" aria-hidden="true" title="查看详情"></i>'#,
        #}
        #lans = []
        #for k,v in settings.LANGUAGES:
            #lans.append({'value':k,'label':v})
            
        #ctx['site_settings']={
            #'lans':lans,
            #'tr':get_tr()
        #}
        
        return ctx      

PcMenu.add_pages(page_dc)

class ProgramerAdmin(BaseEngine):
    url_name='ProgramerAdmin'
    brand = 'ProgramerAdmin'
    mini_brand='PA'
 
    @property
    def menu(self):
        menu=[
            {'label':_('DashBoard'),'url':page('home'),'icon':fa('fa-home')},
            {'label':'账号','url':page('user'),'icon':fa('fa-users'),'visible':can_list((User,Group)),
                 'submenu':[
                     {'label':'账号管理','url':page('jb_user'),'visible':can_touch(User)},
                     {'label':'角色管理','url':page('jb_group'),'visible':can_touch(Group)},
                     {'label':'权限分组','url':page('group_human'),'visible':can_touch(Group)},
                ]},   
            ]
        return menu
    
    def custome_ctx(self, ctx):
        ctx['js_stamp']=js_stamp
        ctx['fast_config_panel']=True
        return ctx    
    
ProgramerAdmin.add_pages(page_dc)
    
