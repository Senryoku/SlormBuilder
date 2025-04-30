import glob
import base64
import sys
import os

GamePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Slormancer"
GameFiles = glob.glob(GamePath + "\\*.json")
DestinationFolder = "./client/src/assets/extracted/"

for filePath in GameFiles:
    try:
        with open(filePath, encoding="utf8") as file:
            content = file.read()
            try:
                json = base64.b64decode(content)
            except:  # Not all files are b64 encoded
                json = content.encode("utf8")
            destName = filePath.split("\\")[-1]
            with open(DestinationFolder + destName, "wb") as destFile:
                destFile.write(json)
                print("Wrote {}".format(destName))
    except:
        print("Unexpected error handling '{}':".format(destName), sys.exc_info()[0])
