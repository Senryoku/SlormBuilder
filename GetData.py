import glob
import base64
import sys
import os

GamePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Slormancer"
GameFiles = glob.glob(GamePath + "\\*.json")
DestinationFolder = "./client/src/assets/extracted/"

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
