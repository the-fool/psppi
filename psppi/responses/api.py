from rest_framework import generics
from .models import Demography
from .serializers import DemographySerializer


class DemographyListView(generics.ListAPIView):
    serializer_class = DemographySerializer
    queryset = Demography.objects.all()
