# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-09-21 01:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='questions.Group'),
        ),
    ]
