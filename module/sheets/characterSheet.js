export default class characterSheet extends ActorSheet{
  get template(){
      return `systems/legends/templates/sheets/${this.actor.type}-sheet.html`;
  }

  activateListeners(html){
      super.activateListeners(html)
      
      html.find(".item-control").click(this._onItemControl.bind(this));
      html.find('.rollable').click(this._onRoll.bind(this));
      html.find('.rollInitiative').click(this._onInitiativeRoll.bind(this));
  }

  /**
 * Handle click events for Item control buttons within the Actor Sheet
 * @param event
 * @private
 */
  _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    const cls = getDocumentClass("Item");
    switch ( button.dataset.action ) {
      case "create-weapon":
        return cls.create({name: "New weapon", type: "weapon"}, {parent: this.actor});
      case "create-teammate":
        return cls.create({name: "New Teammate", type: "teammate"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
    // console.log(this.actor);
  }

  async _onInitiativeRoll(event){
    event.preventDefault();

    const actor = this.actor;
    const combat = game.combat;

    const combatants = combat.getCombatantsByActor(actor);
    const mainCombatant = combatants[0];
    const combatantIds = []

    // Delete every duplicate combatant except for the first one.
    combatants.forEach(combatant => {
      if (combatant != mainCombatant) {
        combatantIds.push(combatant.id);
      }
    });
    await combat.deleteEmbeddedDocuments("Combatant", combatantIds);

    // Roll or reroll initiative
    await game.combat.rollInitiative(mainCombatant.id);
    const mainInitiative = mainCombatant.initiative;

    // Prep new initiatives for the duplicate combatants.
    let newInitiative = mainInitiative - 10;
    let newCombatant = null;

    // Create new combatants as long as their new initiative would be greater than 0.
    while (newInitiative > 0) {
      newCombatant = await combat.createEmbeddedDocuments("Combatant", [mainCombatant]);
      combat.setInitiative(newCombatant[0].id, newInitiative);
      newInitiative = newInitiative - 10;
    }
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