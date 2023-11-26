import os
import glob

base_folder = "./client/src/assets/extracted/sprites"

filenames = [os.path.basename(x) for x in glob.glob(f"{base_folder}/*.png")]

filenames = list(set(["_".join(x.split('_')[:-1]) for x in filenames]))

for filename in filenames:
    print(filename)
    if not os.path.exists(f"{base_folder}/{filename}"):
        os.mkdir(f"{base_folder}/{filename}")
    for file in glob.glob(f"{base_folder}/{filename}_*.png"):
        if os.path.isfile(file):
            print(f" {file} => {f'{base_folder}/{filename}/{os.path.basename(file)}'}")
            os.rename(file, f"{base_folder}/{filename}/{os.path.basename(file)}")

