from django.db import models
from django.contrib.postgres.fields import JSONField


class Question(models.Model):
    code = models.CharField(unique=True, max_length=128)
    text = models.CharField(default='', max_length=512)
    values = JSONField(default={})