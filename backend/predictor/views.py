import os
import joblib
import numpy as np

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class PredictView(APIView):
    def post(self, request):
        try:
            # Get input features from request
            screen_time = float(request.data.get("screen_time"))
            data_usage = float(request.data.get("data_usage"))
            social_media_time = float(request.data.get("social_media_time"))
            gaming_time = float(request.data.get("gaming_time"))

            # Absolute paths using BASE_DIR
            model_path = os.path.join(settings.BASE_DIR, 'model', 'addiction_model.pkl')
            scaler_path = os.path.join(settings.BASE_DIR, 'model', 'scaler.pkl')
            encoder_path = os.path.join(settings.BASE_DIR, 'model', 'label_encoder.pkl')

            # Load model, scaler, encoder
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
            encoder = joblib.load(encoder_path)

            # Preprocess and predict
            X = scaler.transform([[screen_time, data_usage, social_media_time, gaming_time]])
            prediction = model.predict(X)
            label = encoder.inverse_transform(prediction)[0]

            return Response({"addiction_level": label})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
