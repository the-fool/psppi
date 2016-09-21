from .models import Response
from rest_framework import serializers


class ResponseCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ('year', 'value', 'demographics')
