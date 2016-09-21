from django.db import models
from django.contrib.postgres.fields import JSONField

class Group(models.Model):
    name = models.CharField(default='', max_length=128, unique=True)

class Question(models.Model):
    code = models.CharField(unique=True, max_length=128)
    text = models.CharField(default='', max_length=512)
    group = models.ForeignKey(Group, null=True)
    values = JSONField(default={})