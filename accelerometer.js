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
            	msg["payload"]=payload;
            	msg["time_stop"]=Date.now()
            	node.send(msg)
            	payload=[];
            	rowNb=0
            	msg["time_start"]=Date.now()
            	
            	//node.log(JSON.stringify(msg.payload,null,2))
            	node.status({fill:"green",shape:"dot",text:"receiving data ("+ nbData + "/s)"});
            	
            	
        	} else {
        		node.warn("no data")
        		node.status({fill:"red",shape:"dot",text:"no data"});
        	}


        }
        
        function getData() {
        	if (spatial.acceleration.length>0) {
        		//node.log(JSON.stringify(spatial.acceleration))
        		//node.log(spatial.acceleration[0] + " " + spatial.acceleration[1] + " " + spatial.acceleration[2])
	        	row={}
	        	row["accelerometer_x"]= spatial.acceleration[0]
	        	row["accelerometer_y"]= spatial.acceleration[1]
	        	row["accelerometer_z"]= spatial.acceleration[2]        	
	        	//node.log(JSON.stringify(row))
	        	payload.push(row)
	        	
	        	if (payload.length >= message_attended) {
	        		sendMessage()
	        	};
	        		
        	}
        	else{
        		
        		node.warn("no data received (device not ready ?) \n" )
        		//node.status({fill:"red",shape:"dot",text:"device not ready ?"});
        		
        	}
        }
        
        spatial=new Phidget()
        
        //node.log("phidget object=" + JSON.stringify(spatial))
        msg={topic:"accelerometer", payload:payload}

        spatial.connect()
        var inter

        spatial.phidget.addListener("detached", function(){
        	node.warn("Sensor disconnected : " + spatial.phidget.data.board.Name + " ID:" + spatial.phidget.data.board.ID )
        	payload=[]
        	clearInterval(inter);
        	node.status({fill:"red",shape:"dot",text:"device detached"});
        })
        spatial.whenReady(function(){
        	node.log("Sensor connected and ready : "  + spatial.phidget.data.board.Name + " ID:" + spatial.phidget.data.board.ID)
        	inter=setInterval (getData,sensor_update_rate); 
        })
        

        node.log("starting gathering data : message_attended=" + message_attended)
        

    }
    RED.nodes.registerType("accelerometer",AccelerometerNode);
}