import * as skillDataOfficial from "./skillData.js";
import * as skillDataUnofficial from "./skillDataUnofficial.js";
export default class LegendsCharacter extends Actor{

    prepareDerivedData(){

        this._setPowerSettingOptions();
        if (this.system.powerSetting.value != "") {
            this._calcPowerSetting();
        }

        this._calcLevel();

        if (this.system.autoCalc) {
            if (this.system.empowered) {
                this._calcSkills();
            }
            
            this._calcAttr();            
        }

        if (this.system.autoInsp) {
            this._calcInspoBonus();
        }
        console.log(this.system);
    }

    _setPowerSettingOptions(){
        const setting = this.system.powerSetting;
        const npc = this.system.npc;

        if (!npc) {
            setting.options = setting.heroOptions;
        } else {
            setting.options = setting.villainOptions;
        }
    }

    _calcPowerSetting(){
        const setting = this.system.powerSetting;
        var npcModifier = 0;
        if (this.system.npc) {
            npcModifier = 5;
        }
        setting.startingPoints = (5*setting.value+npcModifier)
    }

    _calcLevel(){
        const level = this.system.level;
        const advances = this.system.levelAdvances;
        const active = this.system.activeLevelAdvances;

        var i = 0;
        while (i <= level) {
            if (advances[i] == undefined) {
                advances[i] = {
                    "health": 0,
                    "stamina": 0
                };
            } else {
                advances[i] = active[i];
            }
            i++;
        }

        i = 0;
        while (i < Object.keys(advances).length) {
            delete active[i];
            if (i <= level) {
                active[i] = advances[i];
            }
            i++;
        }
    }

    _calcSkills(){
        const skills = this.system.skills;
        Object.values(skills).forEach(skill => {
            if (skill.powered < skill.unpowered) {
                skill.powered = skill.unpowered;
            }
        });
    }

    _calcAttr(){
        const system = this.system;
        const attributes = system.attributes;
        const skillData = !this.system.unofficialStats ? skillDataOfficial : skillDataUnofficial;

        system.hitPoints.max =     this._calcTotalHP(skillData);
        system.staminaPoints.max = this._calcTotalSP();
        system.armorPoints.max =   this._calcAP();

        attributes.initiative.max =   this._calcInitiative(skillData);
        attributes.defense.max =      this._calcDefense(skillData);
        attributes.accuracy.max =     this._calcAccuracy(skillData);
        attributes.movement.max =     this._calcMovement(skillData);
        attributes.inspiration.max =  this._calcInspiration(skillData);
        attributes.handToHand.max =   this._calcHandtoHand(skillData);
        attributes.recoveries.max =   this._calcRecoveries();
        attributes.maxLift.max =      this._calcMaximumLift(skillData);
        attributes.maxLift.unit =     this._calcMaximumLift(skillData, true);

    }

    _calcBaseHP(skillData){
        const skills = this.system.skills;

        var stamina = (!this.system.empowered ? skills.stamina.unpowered : skills.stamina.powered) + skills.stamina.modifer;
        var staminaData = skillData.staminaData.hpBonusData[this._checkforMax(stamina)];

        var strength = (!this.system.empowered ? skills.strength.unpowered : skills.strength.powered) + skills.strength.modifer;
        var strengthData = skillData.strengthData.hpBonusData[this._checkforMax(strength)];

        var result = this.system.powerSetting.startingPoints + staminaData + strengthData;
        return result + this.system.hitPoints.mod;
    }

    _calcTotalHP(skillData){
        const activeAdvances = this.system.activeLevelAdvances;
        activeAdvances[0].health = this._calcBaseHP(skillData)
        var result = 0;
        Object.values(activeAdvances).forEach(element => {
            result += element.health;
        });
        return result;
    }

    _calcBaseSP(){
        const skills = this.system.skills;

        var stamina = (!this.system.empowered ? skills.stamina.unpowered : skills.stamina.powered) + skills.stamina.modifer;

        var agility = (!this.system.empowered ? skills.agility.unpowered : skills.agility.powered) + skills.agility.modifer;
        var intelligence = (!this.system.empowered ? skills.intelligence.unpowered : skills.intelligence.powered) + skills.intelligence.modifer;
        var speed = (!this.system.empowered ? skills.speed.unpowered : skills.speed.powered) + skills.speed.modifer;
        var strength = (!this.system.empowered ? skills.strength.unpowered : skills.strength.powered) + skills.strength.modifer;

        var result = this.system.powerSetting.startingPoints + this._checkforMax(stamina) + this._checkforMax(Math.max(agility, intelligence, speed, strength));
        return result + this.system.staminaPoints.mod;
    }

    _calcTotalSP(){
        const activeAdvances = this.system.activeLevelAdvances;
        activeAdvances[0].stamina = this._calcBaseSP()
        var result = 0;
        Object.values(activeAdvances).forEach(element => {
            result += element.stamina;
        });
        return result;
    }

    _calcAP(){
        const skills = this.system.skills;

        var result = 0;
        return result + this.system.armorPoints.mod;
    }

    _calcInitiative(skillData){
        const skills = this.system.skills;

        var agility = (!this.system.empowered ? skills.agility.unpowered : skills.agility.powered) + skills.agility.modifer;
        var agilityData = skillData.agilityData.initiativeBonusData[this._checkforMax(agility)];

        var speed = (!this.system.empowered ? skills.speed.unpowered : skills.speed.powered) + skills.speed.modifer;
        var speedData = skillData.speedData.initiativeBonusData[this._checkforMax(speed)];

        var result = Math.max(agilityData, speedData);
        return 10 + result + this.system.attributes.initiative.mod;
    }

    _calcDefense(skillData){
        const skills = this.system.skills;

        var agility = (!this.system.empowered ? skills.agility.unpowered : skills.agility.powered) + skills.agility.modifer;
        var agilityData = skillData.agilityData.defenseBonusData[this._checkforMax(agility)];

        var senses = (!this.system.empowered ? skills.senses.unpowered : skills.senses.powered) + skills.senses.modifer;
        var sensesData = skillData.sensesData.defenseBonusData[this._checkforMax(senses)];

        var result = Math.max(agilityData, sensesData);
        return 10 + result + this.system.attributes.defense.mod;
    }

    _calcAccuracy(skillData){
        const skills = this.system.skills;

        var intelligence = (!this.system.empowered ? skills.intelligence.unpowered : skills.intelligence.powered) + skills.intelligence.modifer;
        var intelligenceData = skillData.intelligenceData.accuracyBonusData[this._checkforMax(intelligence)];

        var senses = (!this.system.empowered ? skills.senses.unpowered : skills.senses.powered) + skills.senses.modifer;
        var sensesData = skillData.sensesData.accuracyBonusData[this._checkforMax(senses)];

        
        var result = Math.max(intelligenceData, sensesData);
        return result + this.system.attributes.accuracy.mod;
    }

    _calcMovement(skillData){
        const skills = this.system.skills;

        var speed = (!this.system.empowered ? skills.speed.unpowered : skills.speed.powered) + skills.speed.modifer;
        var speedData = skillData.speedData.movementSpeedData[this._checkforMax(speed)];

        var result = speedData;
        return result + this.system.attributes.movement.mod;
    }

    _calcInspiration(skillData){
        const skills = this.system.skills;

        var charisma = (!this.system.empowered ? skills.charisma.unpowered : skills.charisma.powered) + skills.charisma.modifer;
        var charismaData = skillData.charismaData.inspireBonusData[this._checkforMax(charisma)];

        var result = charismaData;
        return result + this.system.attributes.inspiration.mod;
    }

    _calcHandtoHand(skillData){
        const skills = this.system.skills;

        var strength = (!this.system.empowered ? skills.strength.unpowered : skills.strength.powered) + skills.strength.modifer;
        var strengthData = skillData.strengthData.hthDamageDieData[this._checkforMax(strength)];

        var result = strengthData;
        var mod = this.system.attributes.handToHand.mod.trim();

        if (mod != "") {
            if (mod.charAt(0)!= '+') {
                mod = '+' + mod;
            }

            result += mod
        }

        return result;
    }

    _calcRecoveries(){
        const skills = this.system.skills;

        var result = 2;
        return result + this.system.attributes.recoveries.mod;
    }

    _calcMaximumLift(skillData, getUnit = false){
        const skills = this.system.skills;

        var strength = (!this.system.empowered ? skills.strength.unpowered : skills.strength.powered) + skills.strength.modifer;
        var strengthData = skillData.strengthData.maximumLiftData[this._checkforMax(strength)];

        var result = strengthData;
        result += this.system.attributes.maxLift.mod;

        var unit = "kg";
        if (result >= 1000) {
            result = result/1000;
            unit = "t";
        }
        if (result >= 1000){
            result = result/1000;
            unit = "kt";
        }

        if (getUnit) return unit;
        else return result;
    }

    _calcInspoBonus(){
        const items = this.items._source;
        const teammates = items.filter(item => {return item.type == "teammate" && item.system.inTeam;});

        var sum = 0;
        teammates.forEach(teammate => {sum += teammate.system.inspiration;});

        this.system.totalInsp = sum;
    }

    _checkforMax(skill){
        const max = !this.system.unofficialStats ? 30 : 50;
        if (skill > max) {
            return max;
        }
        else {
            return skill;
        }
    }
}