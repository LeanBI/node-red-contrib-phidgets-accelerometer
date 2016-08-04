module.exports = function(RED) {
    function AccelerometerNode(config) {
        this.status({fill:"red",shape:"dot",text:"not started"});
        var spawn = require('child_process').spawn;


        RED.nodes.createNode(this,config);
        var node = this;

        toExecute=""
        toExecute+=__dirname + "/accelerometer.py";
        node.log(toExecute);


        const ls = spawn('python',["-u", toExecute,"--sensor_update_rate", "3"]);

        ls.stdout.on('data', (data) => {
            msg=JSON.parse(data)
            this.status({fill:"green",shape:"dot",text:"receiving data"});
            //node.log(this.status)
            node.send(msg);
          });


          ls.stderr.on('data', (data) => {
          msg={ "result":"nok", "payload": data}
          node.warn("result=" + msg["result"]  + " data=" + data)
          node.send(msg)
          }

        );

        ls.on('close', (code) => {
            msg=`process exited ${code}`
          this.status({fill:"red",shape:"dot",text:msg});
          node.log(msg);
        });

        ls.on('error', (err) => {
            msg('Failed to start')
            node.warn(msg);
            this.status({fill:"red",shape:"dot",text:msg});
        });


    }
    RED.nodes.registerType("accelerometer",AccelerometerNode);
}