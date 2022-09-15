export default class characterSheet extends ActorSheet{
    get template(){
        return `systems/legends/templates/sheets/${this.actor.type}-sheet.html`;
    }

    activateListeners(html){
        super.activateListeners(html)
        
    }
}