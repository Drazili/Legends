export default class powerSheet extends ItemSheet{
    get template(){
        return `systems/legends/templates/sheets/${this.item.type}-sheet.html`;
    }
}