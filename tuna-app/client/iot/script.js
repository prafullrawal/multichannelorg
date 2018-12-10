var client = null;
var server = null;
var port = 443;

// We build a deviceId that represents a randomly generated MAC address
var deviceId = null;

var url = null;

var clientId = null;
var interval = 5000;

//clear the interval when connection is lost or failed
var timer = null;
var rId;

//
var orgID = 'xstg32';
var devType = 'TrackingItem';
var devID = 'Mydevice';
var devToken = 'XC(5sCXSqZSbJkgYqw';
var metaData = null;

function connectionLost() {
    console.log("connection lost! - reconnecting");
    clearInterval(timer);
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        useSSL: true
    });
}

function onMessage(topic, payload) {
    var topic = msg.destinationName;
    var payload = msg.payloadString;
    var qos = msg._getQos();
    var retained = msg._getRetained();

    var qosStr = ((qos > 0) ? "[qos " + qos + "]" : "");
    var retainedStr = ((retained) ? "[retained]" : "");
    appendLog(">> [" + topic + "]" + qosStr + retainedStr + " " + payload);
}


function onConnectSuccess() {
    console.log("connected as " + clientId);
    timer = setInterval(publish, interval);
    rId = $("#recordId").val();
    publish();
}

function onConnectFailure() {
  //  $("#deviceId").html("not connected");
    clearInterval(timer);
    console.log("failed! - retry connection w/ clientId "+clientId);
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        userName: "use-token-auth",
        password: devToken,
        useSSL: true
    });
}

function init() {

    try {
        client = new Messaging.Client(server, port, clientId);
    } catch (error) {
        console.log("Error:"+error);
    }
    
    client.onMessageArrived = onMessage;
    client.onConnectionLost = connectionLost;
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        userName: "use-token-auth",
        password: devToken,  
        useSSL: true
    });

    $("#interval").html(interval);
    
    for (var i in sensors) {
        $("#"+i+"Down").click((function(type) {
            return function() {
                if (sensors[type] > lowerLimits[type]) {
                    sensors[type] -= 1;
                    updateSensors();
                }
            }
        })(i));
        $("#"+i+"Up").click((function(type) {
            return function() {
                if (sensors[type] < upperLimits[type]) {
                    sensors[type] += 1;
                    updateSensors();
                }
            }
        })(i));
    }
    console.log("init called");
    updateSensors();
       }
}

function getRandomTemp(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var sensors = {
    temp: 15 + Math.random() * 4,,
};

var lowerLimits = {
    temp: -100,
};

var upperLimits = {
    temp: 100,
};

function updateSensors() {

    for (var i in sensors) {
        if (i == "temp") {
            sensors[i] = Math.floor(parseFloat(sensors[i]));
            $("#"+i+"Reading").html(sensors[i] + "&deg;C");
        }
    }
}


function publish() {
  
    updateSensors();  

    var topic = "iot-2/evt/iotsensor/fmt/json";
    var payload = {
            recordId:rId,
            name: devID,
            temperature:sensors.tem ,   
    };
    var message = new Messaging.Message(JSON.stringify(payload));
    message.destinationName = topic;
    console.log("publish | " + message.destinationName + " | " + message.payloadString);
    client.send(message);
    if(payload.temperature > 20){
        stopIOT();
    }
}


function closeWindow() {  
    server = orgID + ".messaging.internetofthings.ibmcloud.com";
    url = "https://" + orgID + ".internetofthings.ibmcloud.com/?deviceId="+devID;
    url2 = "https://" + orgID + ".internetofthings.ibmcloud.com/dashboard/#/boards";
    clientId = "d:" + orgID + ":" + devType + ":" + devID;
    
    console.log(clientId);
    init();
}


function stopIOT() {

    clearInterval(timer);
    console.log("IOT stopped"); 
    return null;	
}
