from django.core.management.base import BaseCommand
from psppi.columns.models import Column
import pandas as pd


class Command(BaseCommand):
    help = "Gets the long version of title"

    def add_arguments(self, parser):
        parser.add_argument('file_name', nargs='+', type=str)
        parser.add_argument('--quiet', dest='quiet', action='store_true', default=False)

    def handle(self, *args, **kwargs):
        quiet = kwargs.get('quiet')
        keys_seen = set()
        for f in kwargs['file_name']:
            with open(f, 'rb') as infile:
                df = pd.read_csv(f, header=0)
                for _, row in df.iterrows():
                    if row['key'] not in keys_seen:
                        keys_seen.add(row['key'])
                        try:
                            c = Column.objects.get(code=row['key'])
                        except:
                            print('*****  Error on key: {}    *****'.format(row['key']))
                        c.text = row['text']
                        if not quiet:
                            print('{0}: {1}'.format(row['key'], row['text']))
                        c.save()
