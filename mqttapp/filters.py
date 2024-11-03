import django_filters
from .models import recipe_db

class RecipeFilter(django_filters.FilterSet):
    recipeno = django_filters.NumberFilter()
    recipename = django_filters.CharFilter(lookup_expr='icontains')
    mixingspeed = django_filters.NumberFilter()
    mixingtemp = django_filters.NumberFilter()
    mixingtime = django_filters.NumberFilter()

    class Meta:
        model = recipe_db
        fields = ['recipeno', 'recipename', 'mixingspeed', 'mixingtemp', 'mixingtime']
