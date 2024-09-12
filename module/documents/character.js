import * as skillData from "./skillData.js";
export default class LegendsCharacter extends Actor{

    prepareDerivedData(){
        this._setPowerSettingOptions();
        if (this.system.powerSetting.value != "") {
            this._calcPowerSetting();
        }
        if (this.system.autoCalc) {
            if (this.system.empowered) {
                this._calcSkills();
            }
            
            this._calcAttr();            
        }
        if (this.system.autoInsp) {
            this._calcInspoBonus();
        }
        // console.log(this.system);
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

        system.hitPoints.max =     this._calcHP();
        system.staminaPoints.max = this._calcSP();
        system.armorPoints.max =   this._calcAP();

        attributes.initiative.max =   this._calcInitiative();
        attributes.defense.max =      this._calcDefense();
        attributes.accuracy.max =     this._calcAccuracy();
        attributes.movement.max =     this._calcMovement();
        attributes.inspiration.max =  this._calcInspiration();
        attributes.handToHand.max =   this._calcHandtoHand();
        attributes.recoveries.max =   this._calcRecoveries();
        attributes.maxLift.max =      this._calcMaximumLift();

    }

    _calcHP(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var stamina = skillData.staminaData.hpBonusData[skills.stamina.powered];
            var strength = skillData.strengthData.hpBonusData[skills.strength.powered];
        }
        else{
            var stamina = skillData.staminaData.hpBonusData[skills.stamina.unpowered];
            var strength = skillData.strengthData.hpBonusData[skills.strength.unpowered];
        }
        var result = this.system.powerSetting.startingPoints + stamina + strength;
        return result + this.system.hitPoints.mod;
    }

    _calcSP(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var stamina = skills.stamina.powered;

            var agility = skills.agility.powered;
            var intelligence = skills.intelligence.powered;
            var speed = skills.speed.powered;
            var strength = skills.strength.powered;
        }
        else{
            var stamina = skills.stamina.unpowered;

            var agility = skills.agility.unpowered;
            var intelligence = skills.intelligence.unpowered;
            var speed = skills.speed.unpowered;
            var strength = skills.strength.unpowered;
        }

        var result = this.system.powerSetting.startingPoints + stamina + Math.max(agility, intelligence, speed, strength);
        return result + this.system.staminaPoints.mod;
    }

    _calcAP(){
        const skills = this.system.skills;

        var result = 0;
        return result + this.system.armorPoints.mod;
    }

    _calcInitiative(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var agility = skillData.agilityData.initiativeBonusData[skills.agility.powered];
            var speed = skillData.speedData.initiativeBonusData[skills.speed.powered];
        }
        else{
            var agility = skillData.agilityData.initiativeBonusData[skills.agility.unpowered];
            var speed = skillData.speedData.initiativeBonusData[skills.speed.unpowered];
        }

        var result = Math.max(agility, speed);
        return 10 + result + this.system.attributes.initiative.mod;
    }

    _calcDefense(){
        const skills = this.system.skills;


        if (this.system.empowered) {
            var agility = skillData.agilityData.defenseBonusData[skills.agility.powered];
            var senses = skillData.sensesData.defenseBonusData[skills.senses.powered];
        }
        else{
            var agility = skillData.agilityData.defenseBonusData[skills.agility.unpowered];
            var senses = skillData.sensesData.defenseBonusData[skills.senses.unpowered];
        }

        var result = Math.max(agility, senses);
        return 10 + result + this.system.attributes.defense.mod;
    }

    _calcAccuracy(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var intelligence = skillData.intelligenceData.accuracyBonusData[skills.intelligence.powered];
            var senses = skillData.sensesData.accuracyBonusData[skills.senses.powered];
        }
        else{
            var intelligence = skillData.intelligenceData.accuracyBonusData[skills.intelligence.unpowered];
            var senses = skillData.sensesData.accuracyBonusData[skills.senses.unpowered];
        }
        
        var result = Math.max(intelligence, senses);
        return result + this.system.attributes.accuracy.mod;
    }

    _calcMovement(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var speed = skillData.speedData.movementSpeedData[skills.speed.powered];
        }
        else{
            var speed = skillData.speedData.movementSpeedData[skills.speed.unpowered];
        }

        var result = speed;
        return result + this.system.attributes.movement.mod;
    }

    _calcInspiration(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var charisma = skillData.charismaData.inspireBonusData[skills.charisma.powered];
        }
        else{
            var charisma = skillData.charismaData.inspireBonusData[skills.charisma.unpowered];
        }

        var result = charisma;
        return result + this.system.attributes.inspiration.mod;
    }

    _calcHandtoHand(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var strength = skillData.strengthData.hthDamageDieData[skills.strength.powered];
        }
        else{
            var strength = skillData.strengthData.hthDamageDieData[skills.strength.unpowered];
        }

        var result = strength;
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

        if (this.system.empowered) {
        }
        else{
        }

        var result = 2;
        return result + this.system.attributes.recoveries.mod;
    }

    _calcMaximumLift(){
        const skills = this.system.skills;

        if (this.system.empowered) {
            var strength = skillData.strengthData.maximumLiftData[skills.strength.powered];
        }
        else{
            var strength = skillData.strengthData.maximumLiftData[skills.strength.unpowered];
        }

        var result = strength;
        return result + this.system.attributes.maxLift.mod;
    }

    _calcInspoBonus(){
        const items = this.items._source;
        const teammates = items.filter(item => {return item.type == "teammate" && item.system.inTeam;});

        var sum = 0;
        teammates.forEach(teammate => {sum += teammate.system.inspiration;});

        this.system.totalInsp = sum;
    }
}