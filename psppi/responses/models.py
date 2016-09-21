from django.db import models
from psppi.questions.models import Question

class Response(models.Model):
    year = models.IntegerField(default=0)
    column = models.ForeignKey(Question, null=True)
    value = models.IntegerField(default=-1)
