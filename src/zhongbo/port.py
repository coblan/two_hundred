import requests
import json


def get_data(): 
    access_token = get_tokent()
    
    url2 = "http://222.73.31.135:8084/api?access_token=%(access_token)s&handler=event&method=export" % {'access_token': access_token,}
    
    data = {
        'project_id': '201804040003',
        'send_time': '2018-05-11',
        'to_time': '2018-05-12',
    }
    rt = requests.get(url2, params = data)
    print(rt.content)    

def get_tokent(): 
    appkey = 'yuanjingkey12345678910'
    url = 'http://222.73.31.135:8084/api?handler=token&key=%(appkey)s&method=getAccessToken' % {'appkey': appkey,}
    rt = requests.get(url)
    dc = json.loads(rt.content.decode('utf-8'))
    return dc.get('data').get('access_token')

