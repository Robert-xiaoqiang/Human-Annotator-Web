import json

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db.models.query import QuerySet
from django.db.models import Model

from .models import Annotator, MRCSample, SystemOutput, Rating

def index(request):
    all_candidates = SystemOutput.objects.all()
    return build_json_response(True, '', all_candidates)

def build_data_list(data):
    assert data is not None, 'build_data_list can handle QuerySet or Model except NoneType'
    data_json = serializers.serialize('json', data if type(data) == QuerySet else [ data ], use_natural_foreign_keys = True)
    data_list = json.loads(data_json)

def build_json_response(status, message, data):
    if type(data) == list:
        data_list = data
    elif type(data) == QuerySet:
        data_json = serializers.serialize('json', data, use_natural_foreign_keys = True)
        data_list = json.loads(data_json)
    elif type(data) == Model:
        data_json = serializers.serialize('json', [ data ], use_natural_foreign_keys = True)
        data_list = json.loads(data_json)
    else:
        data_list = [ ]

    ret = {
        'status': status,
        'message': message,
        'data': data_list
    }

    return JsonResponse(ret)

def login(request):
    authorization_code = request.POST['authorizationCode']

    try:
        annotator = Annotator.objects.get(authorization_code = authorization_code)
        ret = build_json_response(True, 'log in successfully', annotator)
    except Annotator.DoesNotExist:
        ret = build_json_response(False, 'authorization_code doesn\'t exist', None)
    
    return ret

def allCandidates(request):
    authorization_code = request.POST['authorizationCode']

    try:
        annotator = Annotator.objects.get(authorization_code = authorization_code)
        grouped_candidates = { }
        for obj in SystemOutput.objects.all():
            grouped_candidates.setdefault(obj.sample.id, []).append(obj)

        all_samples = MRCSample.objects.all()
        all_samples_list = json.loads(serializers.serialize('json', all_samples, use_natural_foreign_keys = True))

        # python list of dicts
        for sample in all_samples_list:
            sample['fields']['candidate_questions'] = json.loads(serializers.serialize('json', grouped_candidates[sample['pk']], use_natural_foreign_keys = True, fields = [ 'candidate_question', 'system_key' ]))

        all_samples_with_candidates_list = all_samples_list
        ret = build_json_response(True, '', all_samples_with_candidates_list)
    except:
        ret = build_json_response(False, 'authorization_code doesn\'t exist', None)

    return ret

def rateCandidate(request):
    authorization_code = request.POST['authorizationCode']
    candidates_pks = request.POST['candidates']
    grammaticality_scores = request.POST['grammaticality']
    answerability_scores = request.POST['answerability']
    relevance_scores = request.POST['relevance']

    try:
        annotator = Annotator.objects.get(authorization_code = authorization_code)
        for pk, grammaticality_score, answerability_score, relevance_score in zip(candidates_pks, grammaticality_scores, answerability_scores, relevance_scores):
            target_candidate = SystemOutput.objects.get(pk = pk)
            try:
                rate = Rating.objects.get(annotator = annotator, candidate = target_candidate)
                rate.grammaticality_score = grammaticality_score
                rate.answerability_score = answerability_score
                rate.relevance_score = relevance_score
                rate.save()
            except:
                new_rate = Rating.objects.create(annotator = annotator,
                                                 candidate = target_candidate,
                                                 grammaticality_score = grammaticality_score,
                                                 answerability_score = answerability_score,
                                                 relevance_score = relevance_score)
                new_rate.save()
        ret = build_json_response(True, '', None)
    except Annotator.DoesNotExist:
        ret = build_json_response(False, 'authorization_code doesn\'t exist', None)

    return ret