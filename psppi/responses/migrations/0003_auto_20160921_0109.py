# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-09-21 01:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('responses', '0002_auto_20160921_0105'),
    ]

    operations = [
        migrations.RenameField(
            model_name='response',
            old_name='column',
            new_name='question',
        ),
        migrations.AlterField(
            model_name='response',
            name='demographics',
            field=models.ManyToManyField(to='responses.Demography'),
        ),
    ]
