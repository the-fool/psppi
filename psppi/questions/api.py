from django.db.models import Count
from django.db.models.expressions import RawSQL
from rest_framework import generics
from rest_framework.response import Response as ApiResponse
from .models import Question
from psppi.responses.models import Demography, Response as ResponseModel
from .serializers import QuestionSerializer

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
        responsesQuery = ResponseModel.objects.filter(question_id=instance.pk)

        # check if legal demography filter requested
        demog = request.query_params.get('demog', None)
        if demog and demog in [d.code for d in Demography.objects.all()]:
            responses = responsesQuery.annotate(demog=RawSQL(
                "demographics -> %s", (demog,))).values('demog', 'value', 'year').annotate(Count('value'))
            question['responses'] = [
                {
                    'count': r['value__count'],
                    'value': r['value'],
                    'year': r['year'],
                    'demog': r['demog']
                } for r in responses
            ]
        else:
            responses = responsesQuery.values(
                'value', 'year').annotate(Count('value'))
            question['responses'] = [
                {
                    'count': r['value__count'],
                    'value': r['value'],
                    'year': r['year'],
                    'demog': 'any'
                } for r in responses
            ]
        return ApiResponse(question)
