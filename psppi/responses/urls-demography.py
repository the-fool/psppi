from django.conf.urls import url

from . import api

urlpatterns = [
    url(
        r'^$',
        view=api.DemographyListView.as_view(),
        name='list'
    )
]
