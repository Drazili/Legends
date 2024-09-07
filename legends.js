import itemSheet from "./module/sheets/itemSheet.js";
import character from "./module/documents/character.js";
import characterSheet from "./module/sheets/characterSheet.js";

// Hooks.on("renderCombatTracker", (app, html, data) => {
//     console.log("!!!!!!");
//     console.log(data.combats);
// });

Hooks.once("init", function(){
    console.log("Legends | Initializing legends");

    CONFIG.Combat.initiative = {
        formula: "1d20 + @attributes.initiative.value"
    };    

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("legends", itemSheet, {makeDefault: true});

    CONFIG.Actor.documentClass = character;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("legends", characterSheet, {makeDefault: true});
});

Hooks.on('renderActorSheet', (app, html, data) => {
  // Tab functionality
  const tabLinks = html.find('.tab-link');
  const tabContents = html.find('.tab-content');

  // Retrieve the active tab from localStorage or default to 'tab-1'
  let activeTab = localStorage.getItem('activeTab') || 'tab-1';

  // Set the initial active tab based on the stored state
  tabLinks.removeClass('current');
  tabContents.removeClass('current');
  html.find(`.tab-link[data-tab="${activeTab}"]`).addClass('current');
  html.find(`#${activeTab}`).addClass('current');

  // Tab click event listener
  tabLinks.on('click', function () {
    const tabId = $(this).data('tab');

    // Update the tab state and persist it to localStorage
    tabLinks.removeClass('current');
    tabContents.removeClass('current');
    $(this).addClass('current');
    html.find(`#${tabId}`).addClass('current');

    localStorage.setItem('activeTab', tabId); // Store the active tab
  });

  // Add Attack functionality
  const addAttackButton = html.find('#add-attack');
  const removeAttackButton = html.find('#remove-attack'); // Selector for remove button
  const attacksContainer = html.find('.attacks-container');

  addAttackButton.on('click', function () {
    const attackId = Date.now(); // Generate a unique ID for each attack
    const attackTemplate = `
      <div class="flexrow list attack-row" data-id="${attackId}">
        <div class="info flexrow fullgrey">
          <div></div>
          <a class="info rollable" data-roll="d20+@attributes.accuracy.max + @weapons.${attackId}.attackBonus" data-label="Attack">Attack</a>
          <div></div>
        </div>
        <input class="info" type="text" name="system.weapons.${attackId}.attackBonus" data-dtype="String" placeholder="Bonus">
        <input class="info" type="text" name="system.weapons.${attackId}.name" data-dtype="String" placeholder="Name">
        <input class="info" type="text" name="system.weapons.${attackId}.formula" data-dtype="String" placeholder="Formula">
        <input class="info" type="text" name="system.weapons.${attackId}.type" data-dtype="String" placeholder="Type">
        <input class="info" type="number" name="system.weapons.${attackId}.cost" data-dtype="Number" placeholder="SP Cost">
        <button class="remove-attack" type="button">Remove</button>
        <a class="info rollable" data-roll="@weapons.${attackId}.formula" data-label="@weapons.${attackId}.name: @weapons.${attackId}.type damage">Damage</a>
      </div>
    `;
    console.log('Adding new attack:', attackId); // Debugging line
    attacksContainer.append(attackTemplate); // Append the new attack template to the container

     // Bind the roll button event listener for the newly added attack
     html.find(`#roll-attack-${attackId}`).on('click', function () {
      // Get the Bonus input value
      const bonusInput = html.find(`input[name="system.weapons.${attackId}.attackBonus"]`).val().trim();
      let bonusValue = 0; // Default bonus value

      if (bonusInput === "" || isNaN(bonusInput)) {
        // If empty or not a number, default to 0
        ui.notifications.warn("Invalid Bonus: Defaulting to 0.");
      } else {
        bonusValue = parseInt(bonusInput, 10); // Parse the valid number
      }

      // Proceed with rolling using the valid bonus value
      const rollFormula = `1d20 + ${bonusValue} + @attributes.accuracy.max`;
      // Perform the roll using Foundry's roll API (or your system's roll handler)
      new Roll(rollFormula, data).roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: app.actor }),
        flavor: `Attack Roll with Bonus: ${bonusValue}`,
      });
    });

    // Re-bind the remove button event listener for the newly added attack
    html.find(`.attack-row[data-id="${attackId}"] .remove-attack`).on('click', function () {
      $(this).closest('.attack-row').remove();
    });
  });

  // Remove Attack functionality
  removeAttackButton.on('click', function () {
    const lastAttackRow = attacksContainer.find('.attack-row').last(); // Select the last attack row
    if (lastAttackRow.length) { // Check if there is any attack row to remove
      lastAttackRow.remove(); // Remove the last attack row
      console.log('Removed last attack row:', lastAttackRow.data('id')); // Debugging line
    }
  });
});
