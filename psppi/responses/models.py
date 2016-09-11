from django.db import models
from psppi.columns.models import Column

class Response(models.Model):
    year = models.IntegerField(default=0)
    column = models.ForeignKey(Column, null=True)
    value = models.IntegerField(default=-1)
    