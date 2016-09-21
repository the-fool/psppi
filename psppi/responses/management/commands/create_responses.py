from django.core.management.base import BaseCommand
from psppi.questions.models import Question
from psppi.responses.models import Response, Demography
import pandas as pd
import os


class Command(BaseCommand):
    help = "Gets all the responses!"

    def add_arguments(self, parser):
        parser.add_argument('--fname', nargs='+', default='', type=str)

    def handle(self, *args, **kwargs):
        Response.objects.all().delete()
        responses = []

        # Get hash dict of question objects
        questions = {}
        for q in Question.objects.all():
            questions[q.code] = q

        # Get list of possible demographies
        demographics = [d.code for d in Demography.objects.all()]
        responses = []
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
                demogs = [d for d in df.keys() if d in demographics]
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
                                demographics={demog: row[demog] for demog in demogs if not pd.isnull(row[demog])}
                            )
                        )
        Response.objects.bulk_create(responses)
