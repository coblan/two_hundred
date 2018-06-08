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

DATA_PROXY ={
    'http': 'socks5://localhost:10899',
} 
DEV_STATUS='dev'
GDAL_LIBRARY_PATH = r'C:\Program Files\GDAL\gdal202'
YUAN_JING='http://222.73.31.135:8084'

LOGGING = {
    'version': 1, # 标示配置模板版本，int 类型，目前只接收 `1`这个值。
    'disable_existing_loggers': False, 
    'formatters': {
        'standard': {
             'format': '%(levelname)s %(asctime)s %(message)s',
        },
    },
    'filters': {
        # 这里是定义过滤器，需要注意的是，由于 'filters' 是 logging.config.dictConfig 方法要求在配置字典中必须给订的 key ,所以即使不使用过滤器也需要明确给出一个空的结构。
    },
    'handlers': {
         'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter':'standard',
        },
        'rotfile':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*5,
            'backupCount':3,
            'formatter':'standard',
            'filename': os.path.join(LOG_PATH,'task.log'),            
            }, 
        'caseFile':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*5,
            'backupCount':3,
            'formatter':'standard',
            'filename': os.path.join(LOG_PATH,'case_file.log'),            
            },         
    },
    'loggers': {
        #'django.request': {
            #'handlers': ['tofile'],
            #'level': 'DEBUG',
            #'propagate': True,
        #},
        'case': {
            'handlers': ['caseFile'],
            'level': 'DEBUG',
            'propagate': True,            
            },
        'task':{
            'handlers': ['rotfile'],
            'level': 'DEBUG',
            'propagate': True,            
        },
        'django.request': {
            'handlers': ['rotfile'],
            'level': 'ERROR',
            'propagate': True,
        },        
    }
}

