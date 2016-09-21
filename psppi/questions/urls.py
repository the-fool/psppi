from django.conf.urls import url

from . import api

urlpatterns = [
    url(
        r'^$',
        view=api.QuestionListView.as_view(),
        name='list'
    ),
    url(
        r'^(?P<pk>.+)$',
        view=api.QuestionDetailView.as_view(),
        name='detail'
    )
]
