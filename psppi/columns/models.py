from django.db import models

class Column(models.Model):
    code = models.CharField(unique=True)
    title = models.CharField(default='')