from helpers.director.base_data import site_cfg
from django.utils.translation import ugettext as _

def get_permit(): 
    permit = [
        { 'label': '案件管理',
         'children': [
             { 'label': '案件列表查看', 'value': 'TbBanner',}, 
             { 'label': '案件列表编辑', 'value': 'TbAppversion',}, 
             { 'label': '案件分类', 'value': 'TbNotice',}, 
             ]
         }, 
        { 'label': '案件统计',
         'children': [
             {'label': '案件状态', 'value': 'TbAccount',}, 
             {'label': '案件走势', 'value': 'TbLoginlog',}, 
             ],
         }, 
        {'label': _('GIS分析'),
         'children': [
             {'label': '散点图', 'value': 'TbChannel',}, 
             ],
        }, 
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