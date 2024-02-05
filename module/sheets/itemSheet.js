export default class itemSheet extends ItemSheet{
    get template(){
        return `systems/legends/templates/sheets/item-${this.item.type}-sheet.html`;
    }
}