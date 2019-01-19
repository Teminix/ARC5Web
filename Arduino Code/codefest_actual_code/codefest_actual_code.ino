#include <WiFiServer.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>


#define DHTTYPE DHT11
#define dht_dpin 4  //digital pin 4 for data output of the Temperature sensor

DHT dht (dht_dpin, DHTTYPE);


int LDRpin = A0;
int LDR_Value = 0;

bool LDRon = false; // sets LDR value to off, which is false
bool DHTon = false; // sets DHT value to off, which is false  

const char *ssid = "codefest";
const char *pass = "OakCodfest@2019";

String page = "";
String text = ""; 
String data = "";

int LDRontime = 0;
int DHTontime = 0;


void setup() {
    dht.begin(); //starts dht sensor
    
       Serial.begin(9600); 
       delay(10);
               
       Serial.print("Connecting to ");
       Serial.println(ssid); 
 
       WiFi.begin(ssid, pass); 
       while (WiFi.status() != WL_CONNECTED) 
          {
            delay(500);
            Serial.print(".");
          }
      Serial.println("");
      Serial.println("WiFi connected to "); 
      Serial.print(ssid); //notifies connection is successful 
      
      Serial.println("");
      Serial.println("IP address: ");
      Serial.print(WiFi.localIP()); //displays IP address that data is sending to


   /*    server.on("/data.txt", [](){
        text = (String)data;
        server.send(200, "text/html", text);
      });
*/     
}

void loop(void){ //there is a void inside of the loop 
    float floattemp = dht.readTemperature(); //temperature data output

    int temp = round(floattemp);
    
    if(WiFi.status() == WL_CONNECTED){
    
    HTTPClient http;
    http.begin("http://192.168.1.170:8001/");

    http.addHeader("Content-Type", "text-plain");
    int httpCode = http.POST(temp); 
    
    String payload = http.getString();
    Serial.println(httpCode);   
    Serial.println(payload);

    http.end();

    }

    else{
      Serial.print("Error in Wifi connection");
    }

    delay(5000);


/*
    int LDRvalue = analogRead(LDRpin);
    if (LDRvalue < 100){
      LDRon = !LDRon;
    }

    
    if (temp > 30){
      DHTon = !DHTon;
    }

    if (LDRon == true){
      delay(1000);
      LDRontime++;
    }
    
    if (DHTon == true){
      delay(1000);
      DHTontime++; 
    }

    */  
}
