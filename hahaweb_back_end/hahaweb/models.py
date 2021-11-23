from django.db import models

class Annotator(models.Model):
    authorization_code = models.CharField(max_length = 8)
    phone_number = models.CharField(max_length = 11)

# dataset_key: SQuADv1, SQuADv2, HotpotQA
class MRCSample(models.Model):
    context = models.CharField(max_length = 4096)
    question = chr
    answer = models.CharField(max_length = 320)
    dataset_key = models.CharField(max_length = 16)

# system_key: BART-QG, GPT2-QG, NQG++
class SystemOutput(models.Model):
    sample = models.ForeignKey(MRCSample, on_delete = models.CASCADE)
    candidate_question = models.CharField(max_length = 720)
    system_key = models.CharField(max_length = 16)

class Rating(models.Model):
    annotator = models.ForeignKey(Annotator, on_delete = models.CASCADE)
    candidate = models.ForeignKey(SystemOutput, on_delete = models.CASCADE)
    score = models.IntegerField(default = 0)
