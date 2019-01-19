#include <WiFiServer.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>


#define DHTTYPE DHT11
#define dht_dpin 4  //digital pin 4 for data output of the Temperature sensor

const char *ssid = "oakridge";
const char *pass = "Oak@Blr123";

String page = "";
String text = ""; 
String data = "";


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

    int LDRvalue = analogRead(LDRpin);
    if (LDRvalue < 100){
      LDRon = !LDRon;
    }

    float temp = dht.readTemperature(); //temperature data output
    

    if (temp > 30){
      DHTon = !DHTon;
    }
    
      //data = LDRvalue
  

}
