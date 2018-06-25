# encoding:utf-8
from .base import *
import sys

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

DATA_PROXY ={
    'http': 'socks5://localhost:10899',
} 
DEV_STATUS='dev'

GDAL_LIBRARY_PATH = r'C:\Program Files\GDAL\gdal202.dll'

#YUAN_JING='http://222.73.31.135:8084'
YUAN_JING='http://222.73.31.135:8080/yuanjing'

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
        'getcaseFile':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*5,
            'backupCount':3,
            'formatter':'standard',
            'filename': os.path.join(LOG_PATH,'getcase.log'),            
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
            'level':'DEBUG',
            'class': 'logging.StreamHandler',
            'stream': sys.stdout
               },        
    },
    'loggers': {
        'getcase': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,            
            },
        'export_to_sangao': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,            
            },
        'conver_cord':{
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,              
        }
      
    }
}

