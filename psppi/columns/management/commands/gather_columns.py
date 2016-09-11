from django.core.management.base import BaseCommand
import pandas as pd
class Command(BaseCommand):
    help = 'Load column headings into database for a csv'

    def add_arguments(self, parser):
        parser.add_argument('file_name', nargs='+', type=str)
        parser.add_argument('--keys', nargs='*', type=str)
        parser.add_argument('--demographic-keys', nargs='*', type=str)
    def handle(self, *args, **kwargs):
        selected_keys = kwargs['keys']

        for f in kwargs['file_name']:
            with open(f, 'rb') as infile:
                df = pd.read_csv(f, header=0)
                if selected_keys:
                    cols = [k for k in df.keys() if k in set(selected_keys)]
                else:
                    cols = list(df.keys())
                print(cols)


    