from django.core.management.base import BaseCommand
from psppi.responses.models import Demography
import pandas as pd

class Command(BaseCommand):
    help = "Gathers possible demographies"

    def handle(self, *args, **kwargs):
        Demography.objects.all().delete()
        demographics = []
        with open('./data/demographics.csv') as f:
            df = pd.read_csv(f, header=0)
            for _, row in df.iterrows():
                values = {}
                for i in range(10):
                    if not pd.isnull(row[str(i)]): values[i] = row[str(i)]
                print(values)
                demographics.append(
                    Demography(
                        code=row['code'],
                        text=row['text'],
                        values=values
                    )
                )
            Demography.objects.bulk_create(demographics)