# encoding:utf-8
from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'twoHundred',
        'USER': 'root',
        'PASSWORD': 'root533',
        'HOST': '127.0.0.1', 
        'PORT': '5432', 
    },
}

#DEV_STATUS='dev'
#GDAL_LIBRARY_PATH = r'C:\Program Files\GDAL\gdal202'
#YUAN_JING='http://222.73.31.135:8084'
YUAN_JING ='http://xc.yjep.com.cn:8080/yuanjing'

ALLOWED_HOSTS=['10.235.80.248']

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
    }
}

