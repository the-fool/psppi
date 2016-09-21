from .models import Question
from rest_framework import serializers


class QuestionSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()

    class Meta:
        model = Question


class QuestionDetailSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()

    class Meta:
        model = Question
