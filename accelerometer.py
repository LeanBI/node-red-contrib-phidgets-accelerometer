from __future__ import print_function
from time import sleep, time
import random
import json
import logging

import argparse
import sys
import os



class message:
    def __init__(self,topic,update_rate=10):
        self.topic=topic
        self.time_start=time()
        self.time_max=self.time_start + update_rate

        self.payload=[]

    def add_record(self,myValues):
        self.payload.append(myValues)

    def get_json(self,pprint=False):
        if pprint==False :
            r=json.dumps(self, default=lambda o: o.__dict__)
        else :
            r=json.dumps(self, sort_keys=False, indent=4, default=lambda o: o.__dict__)
        return r

    def pprint(self):
        m=self.get_json(True)
        print(m, file=sys.stdout)
        sys.stdout.flush()
        return m

    def nprint(self):
        m=json.dumps(self,sort_keys=False, indent=4, default=lambda o: o.__dict__ )
        print(m, file=sys.stdout)
        sys.stdout.flush()
        return m

    def overdue(self):
        now=time()
        if now > self.time_max :
            return True
        else :
            return False

try :

    #sys.exit(1)
    dir_path = os.path.dirname(os.path.realpath(__file__)) + '/accelerometer_py.log'
    logging.basicConfig(filename=dir_path,level=logging.DEBUG)
    logging.debug(str(sys.argv))

    parser = argparse.ArgumentParser(description='read data from phidget and print it grouped on stdout')

    #parser.add_argument('--sensor_update_rate', nargs=1 ,action="store_true", help="set the update rate from the sensor (in ms)", default=1 )
    #parser.add_argument('--message_update_rate',action="store_true", help="indicate how long data is being collected before sending a message (in s)", default=10 )
    parser.add_argument('--sensor_update_rate', nargs=1, type=int )
    parser.add_argument('--message_update_rate', nargs=1, type=int )
    args = parser.parse_args()

    logging.debug(args)


    myMessage=None
    while True:
        try :
            if myMessage==None :
                myMessage=message("accelerometer",10)

            if myMessage.overdue():
                myMessage = message("accelerometer", 10)

            myMessage.add_record({
                "tstamp" : time(),
                "x" : random.random(),
                "y" : random.random(),
                "z": random.random()
            })

            response =  myMessage.pprint()
            logging.debug("message printed = %s" % response)

        except Exception as e :
            logging.error("error !!!")
            logging.exception(e)
            msg={ "result" : "nok", "payload" : repr(e)}

        logging.debug("sleep for : %s" % args.sensor_update_rate)
        sleep(float(args.sensor_update_rate[0]))


except Exception as e:

    logging.error("pb")
    logging.exception(e)
    raise e