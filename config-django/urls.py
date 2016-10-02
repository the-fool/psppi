# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic.base import TemplateView

api_patterns = [
    url(r'^questions/', include('psppi.questions.urls', namespace='questions')),
    url(r'^demography/', include('psppi.responses.urls-demography', namespace='demography'))
]

urlpatterns = [
    # Django Admin, use {% url 'admin:index' %}
    url(r'^api/v1/', include(api_patterns)),
    url(r'^psppi', TemplateView.as_view(template_name='index.html')),
    url(settings.ADMIN_URL, include(admin.site.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
