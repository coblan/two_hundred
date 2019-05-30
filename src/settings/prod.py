# encoding:utf-8
from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'twoHundred',
        'USER': 'postgres',
        'PASSWORD': '123',
        'HOST': '127.0.0.1', 
        'PORT': '5432', 
    },
}

#DEV_STATUS='dev'
#GDAL_LIBRARY_PATH = r'C:\Program Files\GDAL\gdal202'

# 已经废弃
#YUAN_JING='http://222.73.31.135:8080/yuanjing'
YUAN_JING = 'http://222.73.227.168:8080/yuanjing'

ALLOWED_HOSTS=['192.168.1.248', '10.231.18.23']

import os
LOG_PATH= os.path.join( os.path.dirname(BASE_DIR),'log')

LOGGING = {
    'version': 1, #
    'disable_existing_loggers': False, 
    'formatters': {
        'standard': {
             'format': '%(levelname)s %(asctime)s %(message)s',
        },
    },
    'filters': {
        # 
    },
    'handlers': {
         'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter':'standard',
        }, 
        'getcase':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*5,
            'backupCount':3,
            'formatter':'standard',
            'filename': os.path.join(LOG_PATH,'getcase.log'),            
            },  
        'export_to_sangao':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*5,
            'backupCount':3,
            'formatter':'standard',
            'filename': os.path.join(LOG_PATH,'export_to_sangao.log'),            
            },    
        'conver_cord':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*5,
            'backupCount':3,
            'formatter':'standard',
            'filename': os.path.join(LOG_PATH,'conver_cord.log'),            
            },         
        'console': {
                   'class': 'logging.StreamHandler',
               },        
    },
    'loggers': {
        'getcase': {
            'handlers': ['getcase'],
            'level': 'DEBUG',
            'propagate': True,            
            },
        'export_to_sangao': {
            'handlers': ['export_to_sangao'],
            'level': 'DEBUG',
            'propagate': True,            
            }, 
        'conver_cord':{
            'handlers': ['conver_cord'],
            'level': 'DEBUG',
            'propagate': True,              
        }        
        #'task':{
            #'handlers': ['rotfile'],
            #'level': 'DEBUG',
            #'propagate': True,            
        #},
        #'django.request': {
            #'handlers': ['rotfile'],
            #'level': 'ERROR',
            #'propagate': True,
        #},        
    }
}

