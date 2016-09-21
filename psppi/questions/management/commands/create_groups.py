from django.core.management.base import BaseCommand
from psppi.questions.models import Group
import pandas as pd

class Command(BaseCommand):
    help = "Create groupings for questions"

    def handle(self, *args, **kwargs):
        Group.objects.all().delete()
        with open('./data/questions.csv') as f:
            groups_seen = set()
            df = pd.read_csv(f, header=0)
            for _, row in df.iterrows():
                groups_seen.add(row['group'])
            
            groups = [Group(name=name) for name in groups_seen]
            Group.objects.bulk_create(groups)