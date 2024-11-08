"""
Django settings for mymqtt project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

import environ
env = environ.Env()
environ.Env.read_env()




# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-c(e$r+4s*06kc89&o3dhv+o1z!42c6u+dlm^-2@m@c=8+hzgm1'

# SECURITY WAR
# NING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['mymqtt-y8q5.onrender.com']


# Application definition

INSTALLED_APPS = [
    'daphne' ,
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    'channels_redis',
    'mqttapp',
  
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mymqtt.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'mqttapp', 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'mymqtt.wsgi.application'
ASGI_APPLICATION = 'mymqtt.asgi.application'

# Channels configuration with InMemoryChannelLayer
# Add channel layers configuration

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
       # "hosts": [('127.0.0.1', 6379)],     # local host
        "hosts":  [os.environ.get('REDIS_URL','redis://127.0.0.1:6379')],
        },
    },
}





# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

'''
DATABASES = {

    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'recipe_db_vox9',
        'USER': 'mqtt',
        'PASSWORD': '',
        'HOST': '', 
        'PORT': '5432', 

    }
}
'''
import dj_database_url

DATABASES = {  
    'default' : dj_database_url.parse(env('DATABASE_URL'))    
             
    } 
  


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]





# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'mqttapp', 'static'),
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
  
STORAGES = {
    # ...
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# Assuming BASE_DIR is already defined at the top of your settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'error.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
          'propagate': True,
        },
    },
}# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
