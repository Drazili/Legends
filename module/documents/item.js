export default class LegendsItem extends Item{

    prepareDerivedData(){
        this.system.attackBonus = this._checkStringNull(this.system.attackBonus);
        // console.log(this.system);
    }

    _checkStringNull(value){
        var response = value;
        if (response == null || response == "") {
            response = "0"
        }
        return response;
    }

}