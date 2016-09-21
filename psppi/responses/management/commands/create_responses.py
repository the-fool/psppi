from django.core.management.base import BaseCommand
from psppi.questions.models import Question
from psppi.responses.models import Response, Demography
import pandas as pd
import os

class Command(BaseCommand):
    help = "Pulls question information"

    def handle(self, *args, **kwargs):
        Question.objects.all().delete()
        questions = []
        with open('./data/questions.csv') as f:
            df = pd.read_csv(f, header=0)
            for _, row in df.iterrows():
                values = {}
                for i in range(10):
                    j = str(i)
                    if not pd.isnull(row[j]): values[j] = row[j]
                print(values)
                questions.append(
                    Question(
                        code=row['code'],
                        text=row['text'],
                        group=Group.objects.filter(name=row['group']).first(),
                        values=values
                    )
                )
            Question.objects.bulk_create(questions)