from django.db import models
from psppi.questions.models import Question
from django.contrib.postgres.fields import HStoreField, JSONField


class Demography(models.Model):
    code = models.CharField(unique=True, max_length=128)
    text = models.CharField(default='', max_length=512)
    values = HStoreField(default={})


class Response(models.Model):
    year = models.IntegerField(default=0)
    question = models.ForeignKey(Question, null=True)
    value = models.IntegerField(default=-1)
    demographics = JSONField(default={})
