# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-09-12 00:28
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Column',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=128, unique=True)),
                ('title', models.CharField(default='', max_length=512)),
                ('values', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('is_question', models.BooleanField(default=True)),
            ],
        ),
    ]
