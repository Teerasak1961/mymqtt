from django import forms
from .models import recipe_db_vox9

class RecipeForm(forms.ModelForm):
    class Meta:
        model = recipe_db_vox9
        fields = ['recipeno', 'recipename', 'mixingspeed', 'mixingtemp', 'mixingtime']
