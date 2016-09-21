# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin

api_patterns = [
    url(r'^questions/', include('psppi.questions.urls', namespace='questions'))
]

urlpatterns = [
    # Django Admin, use {% url 'admin:index' %}
    url(r'^api/v1/', include(api_patterns)),
    url(settings.ADMIN_URL, include(admin.site.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
