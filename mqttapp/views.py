# mqttapp/views.py
from django.shortcuts import render, redirect, get_object_or_404

from django.http import JsonResponse
from .mqtt_service import MqttClient
from .models import recipe_db
from .forms import RecipeForm
from .filters import RecipeFilter


def home(request):
    # Initialize the MQTT client if it's not already running
    if not MqttClient.connected:
        MqttClient.start()

    # Initial values for analog tags (these will be updated in real-time via WebSocket)
    initial_analog_values = {
        '100LT01': 0,
        '100TT01': 0,
    }

    # Initial values for device data (these will be updated in real-time via WebSocket)
    initial_device_data = {
        '100M1': {'MaxTime': 0, 'CurrTime': 0, 'Count': 0, 'Status': 0},
        '100Y1': {'MaxTime': 0, 'CurrTime': 0, 'Count': 0, 'Status': 0},
        '100Y2': {'MaxTime': 0, 'CurrTime': 0, 'Count': 0, 'Status': 0},
    }

    initial_recipe_values = {
        'ID': 0,
        'RecipeNo': 0,
        'RecipeName': 0,
        'MixingSpeed': 0,
        'MixingTemp': 0,
        'MixingTime': 0,

    }

    context = {
        'analog_tag_values': initial_analog_values,
        'device_data': initial_device_data,
        'recipe_tag_values': initial_recipe_values,
    }

    return render(request, 'mqttapp/home.html', context)

 
def popupvalve(request):
    return render(request, 'mqttapp/popupvalve.html')

def popupmotor(request):
    return render(request, 'mqttapp/popupmotor.html')


def trend(request):
   
    return render(request, 'mqttapp/trend.html')

def subscribeMQTT(request):
   
       return render(request, 'mqttapp/subscribeMQTT.html')

def publishMQTT(request):
   
       return render(request, 'mqttapp/publishMQTT.html')


def recipe(request):
    # Form processing
    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
    else:
        form = RecipeForm()

    # Filter processing
    recipe_filter = RecipeFilter(request.GET, queryset=recipe_db.objects.all())
    
    context = {
        'form': form,
        'filter': recipe_filter,
    }
    return render(request, 'mqttapp/recipe.html', context)

def addrecipe(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('recipe')  # Redirect to the recipe list after saving
    else:
        form = RecipeForm()

    return render(request, 'mqttapp/addrecipe.html', {'form': form})

def delete_recipe(request, id):
    del_recipe = get_object_or_404(recipe_db, id=id)
    # Delete the recipe
    del_recipe.delete()
    return redirect('recipe')

def edit_recipe(request, pk):
    mixing = get_object_or_404(recipe_db, pk=pk)  # Get the recipe by ID

    if request.method == 'POST':
        form = RecipeForm(request.POST, instance=mixing)
        if form.is_valid():
            form.save()
            return redirect('recipe')  # Redirect to recipe list or detail view
    else:
        form = RecipeForm(instance=mixing)

    return render(request, 'mqttapp/edit_recipe.html', {'form': form, 'mixing': mixing})
   
def currentrecipe(request):
   
    return render(request, 'mqttapp/currentrecipe.html')

def report(request):
   
    return render(request, 'mqttapp/report.html')