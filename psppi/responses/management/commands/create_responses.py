from django.core.management.base import BaseCommand
from psppi.questions.models import Question
from psppi.responses.models import Response, Demography, AvailableDemographyByQuestion
import pandas as pd
import os


class Command(BaseCommand):
    help = "Gets all the responses!"

    def add_arguments(self, parser):
        parser.add_argument('--fname', nargs='+', default='', type=str)

    def handle(self, *args, **kwargs):
        Response.objects.all().delete()
        responses = []

        # Get hash dict of question & demography objects
        questions = {}
        for q in Question.objects.all():
            questions[q.code] = q

        demographies = {}
        for d in Demography.objects.all():
            demographies[d.code] = d

        responses = []
        available_demog_by_question = set()  # (demog, question, year)
        for dataset in os.listdir('./data/datasets'):
            if not dataset.endswith('.csv'):
                continue
            if kwargs['fname'] and dataset not in kwargs['fname']:
                continue

            with open(os.path.join('data/datasets', dataset)) as f:
                df = pd.read_csv(f, header=0)
                year = [int(token) for token in dataset.split('.') if token.isdigit()][0]

                # get relevant columns for this table
                cols = [c for c in df.keys() if c in questions.keys()]
                demogs = [d for d in df.keys() if d in demographies.keys()]
                print("-------\n{0}\n-------\n\nQuestions:\n{1}\n\nDemographics:\n{2}\n\n".format(dataset, cols, demogs))

                # go through the rows creating responses
                for _, row in df.iterrows():
                    for col in cols:
                        if pd.isnull(row[col]) or not type(row[col]) is int:
                            print('BAD VAL :: {0} - {1} : col {2} : val {3}, type: {4}\n'.format(
                                dataset, _, col, str(row[col]), type(row[col])))
                            continue
                        responses.append(
                            Response(
                                year=year,
                                question=questions[col],
                                value=row[col],
                                demographics={demog: int(row[demog]) for demog in demogs if
                                              not pd.isnull(row[demog]) and
                                              (type(row[demog]) is not str or not row[demog].isspace())}
                            )
                        )
                        for demog in demogs:
                            available_demog_by_question.add((demog, col, year))
        Response.objects.bulk_create(responses)
        AvailableDemographyByQuestion.objects.bulk_create([
            AvailableDemographyByQuestion(
                demography=demographies[dbq[0]],
                question=questions[dbq[1]],
                year=dbq[2]
            ) for dbq in available_demog_by_question])
