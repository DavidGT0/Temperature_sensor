#include "secrets.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include "DHTesp.h"

DHTesp dht;

void setup() {
  Serial.begin(115200);
  
  // הגדרת החיישן
  dht.setup(16, DHTesp::DHT22); 

  // התחברות ל-WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(SECRET_SSID, SECRET_PASS);

  // המתנה עד לחיבור מוצלח
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // הדפסת הכתובת לאחר החיבור
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  delay(600000); // המתנה של 10 דקות בין קריאות

  if (WiFi.status() == WL_CONNECTED) {
  
    HTTPClient http; 
    
    // התחלת תקשורת מול הכתובת המאובטחת של השרת שלך ב-Render
    http.begin("https://temperature-sensor-rjj5.onrender.com/update-sensor");
    http.addHeader("X-API-KEY", SECRET_API_KEY);

    float h = dht.getHumidity();
    float t = dht.getTemperature();

    // הדפסה מקומית ל-Serial Monitor לבקרה
    Serial.print("Temp: ");
    Serial.print(t);
    Serial.print("C, Humidity: ");
    Serial.print(h);
    Serial.println("%");

    // אריזת הנתונים למחרוזת בפורמט JSON
    String httpRequestData = "{\"temperature\":" + String(t) + ",\"humidity\":" + String(h) + "}";

    // שליחת בקשת ה-POST לענן
    int httpResponseCode = http.POST(httpRequestData);

    // הדפסת קוד התגובה מהשרת (200 = הצלחה, קוד שלילי = שגיאת תקשורת)
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    
    // סגירת החיבור ושחרור הזיכרון
    http.end();
    
  } else {
    Serial.println("WiFi Disconnected...");
    WiFi.begin(SECRET_SSID, SECRET_PASS); // ניסיון התחברות מחדש במקרה של ניתוק
  }
}
