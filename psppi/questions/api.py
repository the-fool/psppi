from rest_framework import generics

from .models import Question
from .serializers import QuestionSerializer, QuestionDetailSerializer

QUERY = Question.objects.select_related('group').all()


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    queryset = QUERY
    model = Question


class QuestionDetailView(generics.RetrieveAPIView):
    serializer_class = QuestionDetailSerializer
    queryset = QUERY
    model = Question
