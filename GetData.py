import glob
import base64
import sys
import os

GamePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Slormancer"
GameFiles = glob.glob(GamePath + "\\*.json")
DestinationFolder = "./client/src/assets/data/"

for filePath in GameFiles:
    try:
        with open(filePath) as file:
            json = base64.b64decode(file.read())
            destName = filePath.split('\\')[-1]
            with open(DestinationFolder + destName, "wb") as destFile:
                destFile.write(json)
                print("Wrote {}".format(destName))
    except:
        print("Unexpected error handling '{}':".format(destName), sys.exc_info()[0])
   
#os.system(".\\tools\\quickbms\\quickbms.exe .\\quickbms\\yoyogames.bms \"{}/data.win\" {}".format(GamePath, DestinationFolder))
#os.system(".\\tools\\GMExtract_v1.1\\GMExtract.exe \"{}/data.win\" {}".format(GamePath, DestinationFolder))