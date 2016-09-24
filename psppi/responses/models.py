from django.db import models
from psppi.questions.models import Question
from django.contrib.postgres.fields import HStoreField, JSONField


class Demography(models.Model):
    code = models.CharField(unique=True, max_length=128)
    text = models.CharField(default='', max_length=512)
    nice = models.CharField(default='', max_length=128)
    values = HStoreField(default={})


class Response(models.Model):
    year = models.IntegerField(default=0)
    question = models.ForeignKey(Question, null=True, related_name='responses')
    value = models.IntegerField(default=-1)
    demographics = JSONField(default={})


class AvailableDemographyByQuestion(models.Model):
    year = models.IntegerField(default=0)
    demography = models.ForeignKey(Demography, related_name='question_year_permutations', null=True)
    question = models.ForeignKey(Question, related_name='demog_year_permutations', null=True)

    class Meta:
        unique_together = ('year', 'demography', 'question')
