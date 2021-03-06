#include <ESP8266WiFi.h>
#include <WiFiServer.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

             


const char* ssid = "codefest";
const char* password = "OakCodefest@2019";

#define DHTTYPE DHT11
#define dht_dpin 4  //digital pin 4 for data output of the Temperature sensor
DHT dht (dht_dpin, DHTTYPE);

              HTTPClient http;


WiFiServer server(80);


void setup()
{
  dht.begin(); //starts dht sensor

  Serial.begin(9600);
  Serial.println();

  Serial.printf("Connecting to %s ", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  Serial.printf("Web server started, open %s in a web browser\n", WiFi.localIP().toString().c_str());
  }
  Serial.println(" connected");

  server.begin();
}


// prepare a web page to be send to a client (web browser)
String prepareHtmlPage()
{
  String htmlPage =
     String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +  // the connection will be closed after completion of the response
            "Refresh: 5\r\n" +  // refresh the page automatically every 5 sec
            "\r\n" +
            "<!DOCTYPE HTML>" +
            "<html>" +
            "Analog input:  " + String(analogRead(A0)) +
            "</html>" +
            "\r\n";
  return htmlPage;
}

bool sendtimes = 0;

void loop()
{
  WiFiClient client = server.available();
  // wait for a client (web browser) to connect

 
  if (client)
  {    
    sendtimes++;
    Serial.println("\n[Client connected]");
    while (client.connected()){
      // read line by line what the client (web browser) is requesting
      if (client.available())
      {
        String line = client.readStringUntil('\r');
        Serial.print(line);
        // wait for end of client's request, that is marked with an empty line
        
          if(sendtimes%2 == 1){
              int floattemp = dht.readTemperature(); //temperature data output
              String temp = String(floattemp);
              
              String url = "http://192.168.1.170:8001/stream";
              
              http.begin(url);

              for(int x = 21; x<41; x++){
              
                String truetemp = String(x);
                http.addHeader("Content-Type", "text/plain");// 
                int httpCode = http.POST(truetemp); 
              
              
                String payload = http.getString();
                Serial.println(httpCode); 
                String payloadshow = String("payload" + payload);  
                Serial.println(payloadshow);
                delay(3000);
                    http.end();

              }
             }
             if (sendtimes%2 == 0){
                client.stop();
                    http.end();
                

             }
             
      }
              
        }
      }
    
    delay(3500); // give the web browser time to receive the data
    
    client.stop();
    http.end();
    // close the connection:
    
    //Serial.println("[Client disconnected]");
 
}
