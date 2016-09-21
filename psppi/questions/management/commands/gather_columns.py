from django.core.management.base import BaseCommand
from psppi.columns.models import Column
import pandas as pd


class Command(BaseCommand):
    help = 'Load column headings into database for a csv'

    def add_arguments(self, parser):
        parser.add_argument('file_name', nargs='+', type=str)
        parser.add_argument('--keys', nargs='*', type=str)
        parser.add_argument('--demographic-keys', nargs='*', type=str)
        parser.add_argument('--quiet', dest='quiet', action='store_true', default=False)

    def handle(self, *args, **kwargs):
        quiet = kwargs.get('quiet')
        Column.objects.all().delete()

        selected_keys = kwargs['keys']

        for f in kwargs['file_name']:
            with open(f, 'rb') as infile:
                df = pd.read_csv(f, header=0)
                # collect and filter col keys
                if selected_keys:
                    cols = [k for k in df.keys() if k in set(selected_keys)]
                else:
                    cols = list(df.keys())

                if not quiet:
                    for c in cols:
                        print('Adding: {}'.format(c))
                to_save = [Column(code=col) for col in cols]
        Column.objects.bulk_create(to_save)
        if not quiet:
            print('{} columns created'.format(len(to_save)))
