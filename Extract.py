import json

MechanicsDict = {}
for path in ["dat_cla_0", "dat_cla_1", "dat_cla_2"]:
    with open("client/src/assets/extracted/{}.json".format(path), encoding="utf8") as file:
        Skills = json.loads(file.read())
        Mechanics = [s for s in Skills if s['TYPE'] == "mechanics" or s['TYPE'] == "mechanic"]
        for m in Mechanics:
            MechanicsDict[m['EN_NAME']] = {k:v for (k,v) in m.items() if v != "" and v != None}
with open("client/src/assets/data/mechanics.json", "w") as output:
    json.dump(MechanicsDict, output)
    
    
Stats = []
for path in ["dat_sta"]:
    with open("client/src/assets/extracted/{}.json".format(path), encoding="utf8") as file:
        StatsData = json.loads(file.read())
        for s in StatsData:
            stat = {}
            for (k, v) in s.items():
                key = k.lower() if k in [
                    "HELM",
                    "BELT",
                    "BRACER",
                    "GLOVE",
                    "SHOULDER",
                    "BOOT",
                    "RING",
                    "AMULET",
                    "CAPE",
                ] else k
                if k == "ARMOR":
                    key = "body"
                stat[key] = v
            Stats.append(stat)
with open("client/src/assets/data/item_stats.json", "w") as output:
    json.dump(Stats, output)
    