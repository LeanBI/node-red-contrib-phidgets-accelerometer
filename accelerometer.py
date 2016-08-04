from __future__ import print_function
from time import sleep, time
import random
import json

import argparse
import sys


parser = argparse.ArgumentParser(description='read data from phidget and print it grouped on stdout')

parser.add_argument('-s', '--sensor_update_rate',action="store_true", help="set the update rate from the sensor (in ms)", default=10 )
parser.add_argument('-m', '--message_update_rate',action="store_true", help="indicate how long data is being collected before sending a message (in s)", default=10)
args = parser.parse_args()


while True:
    try :
        sensor="accelerometer"

        payload={}
        payload["tstamp"]=time()
        payload[sensor + "_" + "x"]=random.random()
        payload[sensor + "_" + "y"] = random.random()
        payload[sensor + "_" + "z"] = random.random()

        response = {"result": "ok", "payload" : payload}

        response_json=json.dumps(response)

        print(response_json,file=sys.stdout)
        sys.stdout.flush()

    except Exception as e :
        msg={ "result" : "nok", "payload" : repr(e)}
        print(response_json, file=sys.stderr)


    sleep(args.message_update_rate)