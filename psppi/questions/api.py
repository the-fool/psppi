from django.db.models import Count
from django.db.models.expressions import RawSQL
from rest_framework import generics
from rest_framework.response import Response as ApiResponse
from .models import Question
from psppi.responses.models import AvailableDemographyByQuestion, Demography, Response as ResponseModel
from .serializers import QuestionSerializer
from collections import defaultdict

QUERY = Question.objects.select_related('group').all()


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    queryset = QUERY
    model = Question

    def list(self, request):
        queryset = self.get_queryset()
        questions = QuestionSerializer(queryset, many=True).data
        grouped_questions = defaultdict(list)
        for q in questions:
            group = q.pop('group')
            grouped_questions[group].append(q)
        return ApiResponse(grouped_questions)


class QuestionDetailView(generics.RetrieveAPIView):
    serializer_class = QuestionSerializer
    queryset = QUERY
    model = Question

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        question = QuestionSerializer(instance).data

        # ---- gather possible Demographies for this question ---- #
        demogs_with_years = AvailableDemographyByQuestion.objects.filter(question=instance).values('demography__code', 'year')

        # all possible demographies for this particular question
        unq_demog_codes = set([d['demography__code'] for d in demogs_with_years])
        question['demographies'] = list(unq_demog_codes)

        # dictionary of demog codes by year for this question
        demogs_grouped_by_year = defaultdict(list)
        for d in demogs_with_years:
            demogs_grouped_by_year[d['year']].append(d['demography__code'])

        # ---- gather Responses ---- #
        # construct a DRY query
        responsesQuery = ResponseModel.objects.filter(question_id=instance.pk)

        # check if legal demography filter requested
        demog = request.query_params.get('demog', None)
        if demog and demog in unq_demog_codes:
            question['demog'] = demog
            responsesQuery = responsesQuery.annotate(demog=RawSQL(
                "demographics -> %s", (demog,))).values('demog', 'value', 'year')
        else:
            question['demog'] = 'any'
            responsesQuery = responsesQuery.values(
                'value', 'year')

        responses = responsesQuery.annotate(Count('value'))
        grouped_responses = defaultdict(list)
        for r in responses:
            grouped_responses[r['year']].append({
                'count': r['value__count'],
                'value': str(r['value']),  # strings to accomodate JSON
                'demog': str(r.get('demog', -1))  # -1 indicates 'any' demography 
            })

        # -- Hash by year the response values and the possible demography variables for that year -- #
        question['responses'] = {}
        for year in grouped_responses.keys():
            question['responses'][year] = {
                'demographies': demogs_grouped_by_year[year],
                'values': sorted(grouped_responses[year], key=lambda k: k['value'])
            }

        return ApiResponse(question)
