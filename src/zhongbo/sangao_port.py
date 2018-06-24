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
import hashlib
import os
from urllib.parse import urlencode


proxies =  getattr(settings, 'DATA_PROXY','')

def put_task_to_sangao(images,address,remark):
    #taskid=get_taskid()
    #upload_image(r'C:\Users\Administrator\Desktop\JE20180308170521.jpg')
    #add_dc = address_2_info('会卓路涞港路闲置地')
    #submit_task(add_dc,"三高系统测试案件，请删除" , taskid)
    if 'Cookie' not in headers:
        headers['Cookie']=get_cookie()
    taskid=get_taskid()
    for image in images:
        image_path = save_image(image)
        upload_image(image_path)
    add_dc = address_2_info(address)
    success = submit_task(add_dc,remark , taskid)
    if not success:
        headers['Cookie']=get_cookie()
        taskid=get_taskid()
        for image in images:
            image_path = save_image(image)
            upload_image(image_path)
        add_dc = address_2_info(address)
        success = submit_task(add_dc,remark , taskid)
        if not success:
            raise UserWarning('上传任务失败')
    return taskid

def get_cookie():
    url = 'http://10.231.18.25/CityGrid/Logon.aspx'
    s = requests.Session()
    
    rt = s.get(url,proxies = proxies)
    cookie  = rt.headers.get('Set-Cookie')
    soup = BeautifulSoup(rt.text)
    #logHeader={
        #'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        #'Cookie':'%s; Hm_lvt_ba7c84ce230944c13900faeba642b2b4=1528377687,1529858265; Hm_lpvt_ba7c84ce230944c13900faeba642b2b4=1529859249'%cookie[:42],
        #'Referer':'http://10.231.18.25/CityGrid/Logon.aspx',
        #'Upgrade-Insecure-Requests':'1',
        #'Content-Type':'application/x-www-form-urlencoded',
        #'Host':'10.231.18.25',
        #'Origin':'http://10.231.18.25',
        #'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.4882.400 QQBrowser/9.7.13039.400'
    #}
    data={
       ' __VIEWSTATE':soup.select_one('#__VIEWSTATE')['value'],
        '__VIEWSTATEGENERATOR':soup.select_one('#__VIEWSTATEGENERATOR')['value'],
        '__EVENTVALIDATION':soup.select_one('#__EVENTVALIDATION')['value'],
        'txt_UserName': '03005',
        'txt_Password':'8', 
        'txt_LogIp':'',
        'btn_Login':'', 
        'ifwidth':'2560',
        'ifheight':'1440'   ,     
    }
   
    
    #data = '__VIEWSTATE=%2FwEPDwUKLTY2NDMxNzc3MGRkk1sQ5TsNvl2ZWXVV%2Fk%2BOiS67vOIsPEAvUh3rDdgEGws%3D&__EVENTVALIDATION=%2FwEWBgKi7IZqAobzk7oOAs61448FAqnM8OsBAoOQ69wEAtvg%2FWWhmSBDBuV8pbA32ZNXQNLjxJkIMjwIWwrWVMejLOTvFQ%3D%3D&txt_UserName=03005&txt_Password=8&ifwidth=1280&ifheight=1024&txt_LogIp=&btn_Login=+'
     
    rt = s.post(url, data = urlencode(data),  proxies = proxies)
    #return rt.headers.get('Set-Cookie')
    return cookie[:42]
    
def save_image(image_url):
    rt = requests.get(image_url)
    h1= hashlib.md5()
    h1.update(rt.content)
    name = h1.hexdigest()
    sufix = re.search('[^\.]+$',image_url).group()
    tmp_dir=os.path.join(settings.MEDIA_ROOT,'yuan_image_tmp')
    try:
        os.makedirs(tmp_dir)
    except OSError:
        pass
    
    file_path = os.path.join(tmp_dir ,name+'.'+sufix)
    with open(file_path,'wb') as f:
        f.write(rt.content)
    return file_path
        

#proxies = {
    #'http': 'socks5://localhost:10855',
#}

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
        #'Cookie': 'ASP.NET_SessionId=taulwuajqqcdlkysgyjci1gx;',
        #'Cookie':'ASP.NET_SessionId=35npwpjlznpol2tpjvxn1ne0', 
} 
#def get_header(reload = False): 
    #inn_header = headers
    #if not reload:
        #inn_header ['Cookie'] = 
    #else:
        #pass
        
    #return inn_header

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
    inn_header = dict(headers)
    inn_header.update(
        {'Content-Type': m.content_type}
    )
    
    rt=requests.post(url,headers=inn_header,data=m ,proxies=proxies)
    # 不用返回什么

def address_2_info(address):
    """
    三高系统，正常返回 1801@180111@18011101@-33126.91779446,-9232.44420218@-/-/-@公园路100号
    
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
    
    inn_header = dict( headers )
    inn_header.update({
        'Accept':'*/*',
        'Referer':'http://10.231.18.25/CityGrid/caseoperate_flat/XINZENG/PUBLICREPORT.ASPX?PROBLEMTYPE=0&RETURNURL=XINZENG/PUBLICREPORT.ASPX?Userid=03005&random=c4f6dbf3-9905-4e6f-6198-7999ddea5a5a',
       'X-Requested-With':'XMLHttpRequest',
       'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
    })
    
    data={
        'arrstring' : json.dumps(arr),
        'btnid':'btnSave',
        'taskid':taskid          
    }
    data_str=parse.urlencode(data)
    rt = requests.post(url,data=data_str,headers=inn_header,proxies=proxies)
    #print(rt.text)
    return rt.text.startswith('"True')
    
    
     
def run():
    taskid=get_taskid()
    upload_image(r'C:\Users\Administrator\Desktop\JE20180308170521.jpg')
    add_dc = address_2_info('会卓路涞港路闲置地')
    submit_task(add_dc,"三高系统测试案件，请删除" , taskid)
    

#upload_image(r'C:\Users\Administrator\Desktop\JE20180308170521.jpg')
#dc = address_2_info('公园路100号')
#print(dc)