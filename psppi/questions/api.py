from djnango.db.models import Count
from rest_framework import generics
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer, QuestionDetailSerializer

QUERY = Question.objects.select_related('group').all()


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    queryset = QUERY
    model = Question


class QuestionDetailView(generics.RetrieveAPIView):
    serializer_class = QuestionSerializer
    queryset = QUERY
    model = Question

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        question = QuestionSerializer(instance).data
        responses = Response.objects.filter(question_id=instance.pk).values('value', 'year').annotate(Count('value'))
        return Response(question)