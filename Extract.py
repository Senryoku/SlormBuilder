import json
 
with open("client/src/assets/data/dat_cla_0.json", encoding="utf8") as file:
    Skills = json.loads(file.read())
    Mechanics = [s for s in Skills if s['TYPE'] == "mechanics"]
    MechanicsDict = {}
    for m in Mechanics:
        MechanicsDict[m['EN_NAME']] = {k:v for (k,v) in m.items() if v != "" and v != None}
    with open("client/src/assets/data/mechanics.json", "w") as output:
        json.dump(MechanicsDict, output)