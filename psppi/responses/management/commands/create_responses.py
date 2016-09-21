from django.core.management.base import BaseCommand
from psppi.questions.models import Question
from psppi.responses.models import Response, Demography
import pandas as pd
import os
from collections import defaultdict

class Command(BaseCommand):
    help = "Gets all the responses!"

    def handle(self, *args, **kwargs):
        Response.objects.all().delete()
        responses = []

        # Get hash dict of question objects
        questions = {}
        for q in Question.objects.all():
            questions[q.code] = q
            
        for dataset in os.listdir('./data/datasets'):
            if not dataset.endswith('.csv'):
                continue
            with open(dataset) as f:
                df = pd.read_csv(f, header=0)
                year = [int(token) for token in dataset.split('.') if token.isdigit()][0]
                # get relevant columns for this table
                cols = [c for c in df.keys if c in questions.keys()]
                print("{0}: columns: {1}".format(dataset, cols))

                # go through the rows creating responses
                for _, row in df.iterrows():
                    for col in cols:
                        if pd.isnull(row[col]):
                            continue
                        r = Response(
                                year=year
                                question=questions[col],
                                value=row[col])
                        r.save()
                        demographics = [

                        ]
                        Through = Demography.response.through
                        Through.objects.bulk_create([
                            Through(response_id=r.pk)
                        ])
                