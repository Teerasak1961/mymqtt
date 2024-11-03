from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('popupvalve/', views.popupvalve, name='popupvalve'),
    path('popupmotor/', views.popupmotor, name='popupmotor'),
    path('trend/', views.trend, name='trend'),
    path('subscribeMQTT/',views.subscribeMQTT, name='subscribeMQTT'),
    path('publishMQTT/',views.publishMQTT, name='publishMQTT'),
    path('recipe/',views.recipe, name='recipe'),
    path('delete_recipe/<int:id>/', views.delete_recipe),
    path('addrecipe/',views.addrecipe, name='addrecipe'),
    path('currentrecipe/',views.currentrecipe, name='currentrecipe'),
     path('report/',views.report, name='report'),
    path('edit-recipe/<int:pk>/', views.edit_recipe, name='edit_recipe'),
]
  

