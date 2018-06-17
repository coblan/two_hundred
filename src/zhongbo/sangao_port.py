# encoding:utf-8
#from __future__ import unicode_literals


"""
requests使用formdata 上传数据，需要安装下面的pakage
pip install requests-toolbelt
"""

import requests
from bs4 import BeautifulSoup
import re
from requests_toolbelt import MultipartEncoder
import json
from urllib import parse
from django.conf import settings
proxies = {
    'http':settings.PROXIY
}

def put_task_to_sangao():
    taskid=get_taskid()
    upload_image(r'C:\Users\Administrator\Desktop\JE20180308170521.jpg')
    add_dc = address_2_info('会卓路涞港路闲置地')
    submit_task(add_dc,"三高系统测试案件，请删除" , taskid)



proxies = {
    'http': 'socks5://localhost:10855',
}

headers={
        'Cache-Control': 'max-age=0',
        'Origin': 'http://10.231.18.25',
        'Upgrade-Insecure-Requests': '1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'http://10.231.18.25/CityGrid/caseoperate_flat/SelectMediaInfo.aspx?CaseStatus=T&TaskId=1806J9617532&CaseType=',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.4882.400 QQBrowser/9.7.13039.400',
        'Cookie':'ASP.NET_SessionId=2sx0h4zdammuosiaaqjmuuxt; .ASPXAUTH=52498BC697C663AADB48806780E025A8330C775B858282AD21127CD82C299EA1CDBF97E4BD04B7DB5332A4F74143B014E889CEA863748473119C93BA53047503F2D19F83CFB9499D8E9878A9174E0E430B7D3F404ECA01203F7A0C6C30E4107C3D4EB2A1C342FA428C0B12B83EFA5EA244EB740704897D248D060BFC6146C1B39CF4BC54B025EFA30AA1E98F6CC0C278; ScreenWidth=2560; ScreenHeight=1440; Hm_lvt_ba7c84ce230944c13900faeba642b2b4=1528377687; Hm_lpvt_ba7c84ce230944c13900faeba642b2b4=1528379507; LoginType=login',
    } 

def get_taskid():
    url='http://10.231.18.25/CityGrid/caseoperate_flat/XINZENG/PUBLICREPORT.ASPX?PROBLEMTYPE=0&RETURNURL=XINZENG/PUBLICREPORT.ASPX?Userid=03005&random=c4f6dbf3-9905-4e6f-6198-7999ddea5a5a'
    rt = requests.get(url,proxies=proxies)
    soup = BeautifulSoup(rt.text)
    try:
        ss = soup.select('#taskhid')
        taskid= ss[0]['value']
        return taskid
    except:
        print('不能从html中获取taskid')

def upload_image(fl_path):
    """"""
    url="http://10.231.18.25/CityGrid/caseoperate_flat/SelectMediaInfo.aspx?CaseStatus=T&TaskId=1806J9617532&CaseType="  
    mt=re.search(r'[^/\\]+\.(\w+)',fl_path)
    base_name=mt.group()
    sufix=mt.group(1)
    
    m = MultipartEncoder(
        fields={'PicFile': (base_name, open(fl_path, 'rb'), 'image/%s'%sufix),
                '__VIEWSTATE':'/wEPDwUKMTQ5OTMyNDAzMg9kFgICAw8WAh4HZW5jdHlwZQUTbXVsdGlwYXJ0L2Zvcm0tZGF0YRYEAgMPFgIeCGRpc2FibGVkZGQCBA8WAh8BZGRkxQ4oQ+NFCYp1YlXGoghvWLTK0TKp7dexirT328BUhtI=',
                '__EVENTVALIDATION':'/wEWDwK1nLsZAuzJ454LAsmem4wMAuXu0mECg8an8gcCkqKqlg8Cp52w5QYC766n2gECr5/YsgoC4b2wlA8C/ZKZjwEC5Ov3nAsC3oSUrwoCg9v//wECi5OlxgWm5woeEIk+sjqp15HTFl0yKUHW9raB4mAhFPwwYIXqmA==',
                'btnPicAddOk':'提交',
                'pageindex':'0'}
        )
    
    headers.update(
        {'Content-Type': m.content_type}
    )
    
    rt=requests.post(url,headers=headers,data=m ,proxies=proxies)
    # 不用返回什么

def address_2_info(address):
    """
    正常返回 1801@180111@18011101@-33126.91779446,-9232.44420218@-/-/-@公园路100号
    
    """
    url='http://10.231.18.25/CityGrid/AjaxHandlers/Ajax_GetGis.ashx?Method=GetStreetInfo&Address=%s'%address
    rt = requests.get(url,proxies=proxies)
    ls=rt.text.split('@')
    x,y=ls[3].split(',')
    dc = {
        'select_street':ls[0],
        'select_community':ls[1],
        'select_grid':ls[2],
        'hdn_X':x,
        'hdn_Y':y,
        'text_address':address
    }
    return dc
    


def submit_task(address_dc,remark,taskid):
    """
    """
    url = 'http://10.231.18.25/CityGrid/XinZeng/PublicReport'
    # 下面是公园路100号的信息,后面直接update成新地址的dict
    arr={"text_reporter":"",
         "text_phoneno":"",
         "text_address":'公园路100号',
         "hdn_X":"-33126.91779446",
         "hdn_Y":"-9232.44420218",
         "text_reptheme":"",
         "text_completeTime":"",
         "txt_spsignName":"",
         "txt_spsignCode":"",
         "chk_caseend":False,
         "IsWeiFa":"1",
         "Btn_FuZhu":"辅助信息",
         "addmedia":"添加附件",
         "btnAccept":"受  理",
         "btnAccept_ReturnUrl":"",
         "btnSave":"确  定",
         "btnSave_ReturnUrl":"",
         "hide_deptcode":"101",
         "area_description":"三高系统测试案件，请删除",
         "select_infosource":"9",
         "select_street":"1801",
         "select_community":"180111",
         "select_grid":"18011101",
         "select_gridtype":None,
         "select_new_street":None,
         "select_new_workgrid":None,
         "select_new_grid":None,
         "InputArea":None,
         "select_infotype":"1",
         "select_bclass":"92",
         "select_sclass":"01",
         "select_zclass":"01",
         "select_mangageContent":None,
         "select_EmergDegree":"0",
         "select_river":"310118001237"}
    
    arr.update(address_dc)
    arr['area_description']=remark
    
    header2=headers
    header2.update({
        'Accept':'*/*',
        'Referer':'http://10.231.18.25/CityGrid/caseoperate_flat/XINZENG/PUBLICREPORT.ASPX?PROBLEMTYPE=0&RETURNURL=XINZENG/PUBLICREPORT.ASPX?Userid=03005&random=c4f6dbf3-9905-4e6f-6198-7999ddea5a5a',
       'X-Requested-With':'XMLHttpRequest',
       'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
       'Cookie':'ASP.NET_SessionId=2sx0h4zdammuosiaaqjmuuxt; LoginType=login; .ASPXAUTH=79102B15085CD11881CBC9DB5BBD4EC4C53A885F440D8559668F4C44E81CC613B776B55ECAC2094D9017CF8CA6C0852BEE0229021E08E52E131542E861A0FA2944706F987F77D576130A282107C00F8BC2A329339C80C523B48F9F87218B1A9C6C5DCE42111B873A17C1522BF94D46489DB19D8E2202E36EC5B2522D414FDA9492E3D971DFFFE0F60BB28521E93A5438; ScreenWidth=2560; ScreenHeight=1440; Hm_lvt_ba7c84ce230944c13900faeba642b2b4=1528377687; Hm_lpvt_ba7c84ce230944c13900faeba642b2b4=1528387575'
    })
    
    data={
        'arrstring' : json.dumps(arr),
        'btnid':'btnSave',
        'taskid':taskid          
    }
    data_str=parse.urlencode(data)
    rt = requests.post(url,data=data_str,headers=header2,proxies=proxies)
    print(rt.text)
    
     
def run():
    taskid=get_taskid()
    upload_image(r'C:\Users\Administrator\Desktop\JE20180308170521.jpg')
    add_dc = address_2_info('会卓路涞港路闲置地')
    submit_task(add_dc,"三高系统测试案件，请删除" , taskid)
    
run()
#upload_image(r'C:\Users\Administrator\Desktop\JE20180308170521.jpg')
#dc = address_2_info('公园路100号')
#print(dc)