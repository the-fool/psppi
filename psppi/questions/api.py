from django.db.models import Count
from django.db.models.expressions import RawSQL
from rest_framework import generics
from rest_framework.response import Response as ApiResponse
from .models import Question
from psppi.responses.models import Response as ResponseModel
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
        responses = ResponseModel.objects.filter(question_id=instance.pk).annotate(demog=RawSQL("demographics -> %s", ('gender',))).values('demog', 'value', 'year').annotate(Count('value'))
        question['responses'] = [
            {
                'count': r['value__count'],
                'value': r['value'],
                'year' : r['year'],
                'demog': r['demog']
            } for r in responses
        ]
        return ApiResponse(question)
