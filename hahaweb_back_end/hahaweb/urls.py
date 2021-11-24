from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('api/login/', views.login, name = 'login'),
    path('api/allCandidates/', views.allCandidates, name = 'allCandidates'),
    path('api/rateCandidate/', views.rateCandidate, name = 'rateCandidate')
]