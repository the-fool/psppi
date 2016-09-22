from .models import Response, Demography
from rest_framework import serializers


class DemographySerializer(serializers.ModelSerializer):
    class Meta:
        model = Demography
        fields = ('code', 'text', 'values', 'nice')


class ResponseCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ('year', 'value', 'demographics')
