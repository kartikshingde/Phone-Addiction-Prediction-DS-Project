import pandas as pd
import joblib
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import ADASYN
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
df = pd.read_csv("phone_usage_india.csv")

# ✅ Rename columns to match frontend input fields
df.rename(columns={
    'Screen Time (hrs/day)': 'screen_time',
    'Data Usage (GB/month)': 'data_usage',
    'Social Media Time (hrs/day)': 'social_media_time',
    'Gaming Time (hrs/day)': 'gaming_time'
}, inplace=True)

# ✅ Label addiction using a realistic weighted scoring system
def classify_addiction(row):
    score = (
        row['screen_time'] * 0.5 +
        row['social_media_time'] * 0.3 +
        row['gaming_time'] * 0.1 +
        row['data_usage'] * 0.1
    )

    if score > 7:
        return "High Addiction"
    elif score > 3.5:
        return "Moderate Addiction"
    else:
        return "Low Addiction"

# Apply the classification
df["addiction_level"] = df.apply(classify_addiction, axis=1)

# ✅ Input features and target
X = df[["screen_time", "data_usage", "social_media_time", "gaming_time"]]
y = df["addiction_level"]

# ✅ Encode target labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# ✅ Correlation heatmap (Optional)
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")
plt.title("Feature Correlation")
plt.show()

# ✅ Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, stratify=y_encoded, random_state=42
)

# ✅ Balance dataset using ADASYN
adasyn = ADASYN(random_state=42)
X_train_bal, y_train_bal = adasyn.fit_resample(X_train, y_train)

# ✅ Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_bal)
X_test_scaled = scaler.transform(X_test)

# ✅ Train Random Forest model
model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
model.fit(X_train_scaled, y_train_bal)

# ✅ Evaluate model
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy * 100:.2f}%\n")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# # ✅ Save model and encoders
# joblib.dump(model, "addiction_model.pkl")
# joblib.dump(scaler, "scaler.pkl")
# joblib.dump(le, "label_encoder.pkl")
# print("✅ Model, scaler, and label encoder saved successfully!")
