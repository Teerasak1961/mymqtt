from django.db import models

class recipe_db(models.Model):
    id = models.BigAutoField(primary_key=True)
    recipeno   = models.IntegerField(default=0)
    recipename  = models.CharField(max_length=255)
    mixingspeed = models.FloatField()
    mixingtemp  = models.FloatField()
    mixingtime  = models.IntegerField()
  
    class Meta:
        db_table = "tblrecipe"