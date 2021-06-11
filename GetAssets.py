import glob
import base64
import sys
import os

GamePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Slormancer"
DestinationFolder = "./client/src/assets/extracted/"

os.system(".\\tools\\GMExtract_v1.1\\GMExtract.exe \"{}/data.win\" {} -s".format(GamePath, DestinationFolder))