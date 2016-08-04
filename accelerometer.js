module.exports = function(RED) {
    function AccelerometerNode(config) {
        var spawn = require('child_process').spawn;


        RED.nodes.createNode(this,config);
        var node = this;

        toExecute=""
        toExecute+=__dirname + "/accelerometer.py";
        node.log(toExecute);
        //const ls = spawn('python',["/home/leanbi/.node-red/nodes/node-phidgets-accelerometer/accelerometer.py","--message_update_rate", 10 ]);
        //const ls = spawn('python',["/home/leanbi/.node-red/nodes/node-phidgets-accelerometer/accelerometer.py"]);
        args=[toExecute,"--sensor_update_rate","3"]
        node.log("array=" + args);

        const ls = spawn('python',args.concat(toExecute, "test"));

        ls.stdout.on('data', (data) => {
          node.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
          msg=JSON.parse(data)
          if (msg.result=="ok") {
                //node.log("data recieved : " + data)
                node.send(msg)
          } else {
                node.warn("result=" + msg["result"]  + " data=" + data)
                node.send(msg)
          }

        });

        ls.on('close', (code) => {
          node.log(`child process exited with code ${code}`);
        });

        ls.on('error', (err) => {
            node.log('Failed to start child process.');
        });


    }
    RED.nodes.registerType("accelerometer",AccelerometerNode);
}