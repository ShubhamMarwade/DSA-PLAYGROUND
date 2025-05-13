from django.urls import path
from .views import DSAGPTView

urlpatterns = [
    path("dsa-gpt/", DSAGPTView.as_view(), name="dsa_gpt"),
]
