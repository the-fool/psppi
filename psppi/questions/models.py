from django.db import models
from django.contrib.postgres.fields import HStoreField


class Group(models.Model):
    name = models.CharField(default='', max_length=128, unique=True)

    def __str__(self):
        return '{}'.format(self.name)


class Question(models.Model):
    code = models.CharField(unique=True, max_length=128)
    text = models.CharField(default='', max_length=512)
    short = models.CharField(default='', max_length=512)
    notes = models.TextField(default='')
    group = models.ForeignKey(Group, null=True)
    values = HStoreField(default={})
