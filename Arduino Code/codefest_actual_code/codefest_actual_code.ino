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
  
}

void loop() {


}
