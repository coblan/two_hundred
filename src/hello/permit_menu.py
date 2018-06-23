from helpers.director.base_data import site_cfg
from django.utils.translation import ugettext as _

def get_permit(): 
    permit = [
        { 'label': _('Marketing'),
         'children': [
             { 'label': _('Banner'), 'value': 'TbBanner',}, 
             { 'label': _('App Package'), 'value': 'TbAppversion',}, 
             { 'label': _('Notice'), 'value': 'TbNotice',}, 
             { 'label': _('Help'), 'value': 'TbQa',}, 
             { 'label': _('Activity'), 'value': 'TbActivity',}, 
             { 'label': _('AppResource'), 'value': 'TbAppresource',}, 
             ]
         }, 
        { 'label': _('Member'),
         'children': [
             {'label': _('Tb Account'), 'value': 'TbAccount',}, 
             {'label': _('Tb Login Log'), 'value': 'TbLoginlog',}, 
             {'label': _('Tb Balance Log'), 'value': 'TbBalancelog', }, 
          
             ],
         }, 
        {'label': _('MoneyFlow'),
         'children': [
             #{'label': '账目记录', 'value': 'TbBalancelog', }, 
             {'label': '金流渠道', 'value': 'TbChannel',}, 
             {'label': '金流日志', 'value': 'TbChargeflow',}
             ],
        }, 
        {'label': _('Tb Match'), 
         'children': [
             {'label': _('Tb Match'), 'value': 'TbMatches',}, 
             {'label': _('Tb TicketMaster'), 'value': 'TbTicketmaster.all',},              
             ],
        }, 
       
        {'label': _('RiskControl'),
         'children': [
            {'label': _('Tb RC Filter'), 'value': 'TbRcFilter',}, 
            {'label': _('Tb RC Level'), 'value': 'TbRcLevel',}, 
            {'label': _('Tb RC User'), 'value': 'TbRcUser',}, 
            {'label': _('Tb Withdraw Limit Log'), 'value': 'TbWithdrawlimitlog',}, 
                 
                 
             {'label': _('Tb Blankuserlist'), 'value': 'TbBlackuserlist',}, 
             {'label': _('Tb BlackuserlistLog'), 'value': 'TbBlackuserlistLog',}, 
             {'label': _('Blackiplist'), 'value': 'Blackiplist',}, 
             {'label': _('Black IP Range'), 'value': 'Blackiprangelist',}, 
             {'label': _('White IP'), 'value': 'Whiteiplist',}, 
             {'label': _('White User'), 'value': 'Whiteuserlist',}
             ],}, 
        {'label': _('User'),
         'children': [
            #{'label': _('查看用户'), 'value': 'User.read',}, 
             {'label': _('User'), 'value': 'User.write',}, 
             {'label': _('Role'), 'value': 'Group',}
             ],
         }
        
        
    ]
    return permit

site_cfg['permit.options'] = get_permit