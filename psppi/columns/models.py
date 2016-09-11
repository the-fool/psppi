from django.db import models

class Column(models.Model):
    code = models.CharField(unique=True, max_length=128)
    title = models.CharField(default='', max_length=512)
    is_question = models.BooleanField(default=True)