module.exports = function(RED) {

    function AccelerometerNode(config) {
    	var Phidget = require('phidgetapi').Spatial;
    
    	RED.nodes.createNode(this,config);
        var node = this;
        this.status({fill:"red",shape:"dot",text:"not started"});
        
        var payload=[];
        node.log(JSON.stringify(config))
        var sensor_update_rate=config.sensor_update_rate
        var message_update_rate=config.message_update_rate * 1000
        var message_attended= message_update_rate /  sensor_update_rate
        
        function sendMessage(){
        	nbData=payload.length;
        	if (nbData >0){
            	//msg["payload"]=payload;
            	msg["time_stop"]=Date.now()
            	node.send(msg)
            	payload=[];
            	rowNb=0
            	msg["time_start"]=Date.now()
            	
            	node.status({fill:"green",shape:"dot",text:"receiving data ("+ nbData + "/s)"});
        	} else {
        		node.warn("no data")
        		node.status({fill:"green",shape:"dot",text:"no data"});
        	}


        }
        
        function getData() {
        	if (spatial.acceleration.length>0) {
	        	row={}
	        	row["accelerometer_x"]= spatial.acceleration[0]
	        	row["accelerometer_y"]= spatial.acceleration[1]
	        	row["accelerometer_z"]= spatial.acceleration[2]        	
	        	payload.push(row)
	        	
	        	if (payload.length >= message_attended) {
	        		sendMessage()
	        	};
	        		
        	}
        	else{
        		node.warn("no data received (device not ready ?)")
        	}
        }
        
        spatial=new Phidget()
        //node.log("phidget object=" + JSON.stringify(spatial))
        msg={topic:"accelerometer", payload:payload}
        spatial.connect()
        node.log("starting gathering data : message_attended=" + message_attended)
        setInterval (getData,sensor_update_rate); 

    }
    RED.nodes.registerType("accelerometer",AccelerometerNode);
}