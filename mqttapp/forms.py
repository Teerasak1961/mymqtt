from django import forms
from .models import recipe_db

class RecipeForm(forms.ModelForm):
    class Meta:
        model = recipe_db
        fields = ['recipeno', 'recipename', 'mixingspeed', 'mixingtemp', 'mixingtime']
