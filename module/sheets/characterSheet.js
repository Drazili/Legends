export default class characterSheet extends ActorSheet{
    get template(){
        return `systems/legends/templates/sheets/${this.actor.type}-sheet.html`;
    }

    activateListeners(html){
        super.activateListeners(html)
        
        html.find('.rollable').click(this._onRoll.bind(this));
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
    
        // Handle item rolls.
        if (dataset.rollType) {
          if (dataset.rollType == 'item') {
            const itemId = element.closest('.item').dataset.itemId;
            const item = this.actor.items.get(itemId);
            if (item) return item.roll();
          }
        }
    
        // Handle rolls that supply the formula directly.
        if (dataset.roll) {
          let label = dataset.label ? `${dataset.label}` : '';
          let roll = new Roll(dataset.roll, this.actor.getRollData());
          roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
            rollMode: game.settings.get('core', 'rollMode'),
          });
          return roll;
        }
      }
    
}