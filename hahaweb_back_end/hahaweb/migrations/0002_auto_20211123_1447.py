# Generated by Django 3.2.9 on 2021-11-23 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hahaweb', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rating',
            old_name='score',
            new_name='answerability_score',
        ),
        migrations.AddField(
            model_name='rating',
            name='grammaticality_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='rating',
            name='relevance_score',
            field=models.IntegerField(default=0),
        ),
    ]
