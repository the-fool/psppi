from .models import Question
from rest_framework import serializers
from psppi.responses.serializers import ResponseCompactSerializer


class QuestionSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()

    class Meta:
        model = Question


class QuestionDetailSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()
    responses = ResponseCompactSerializer(many=True)

    class Meta:
        model = Question
