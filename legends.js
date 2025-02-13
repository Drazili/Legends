import itemSheet from "./module/sheets/itemSheet.js";
import character from "./module/documents/character.js";
import characterSheet from "./module/sheets/characterSheet.js";
import LegendsItem from "./module/documents/item.js";
import LegendsCharacter from "./module/documents/character.js";

// Hooks.on("renderCombatTracker", (app, html, data) => {
//     console.log("!!!!!!");
//     console.log(data.combats);
// });

Hooks.once("init", function(){
    console.log("Legends | Initializing legends");

    CONFIG.Combat.initiative = {
        formula: "1d20 + @attributes.initiative.max + (@attributes.initiative.max / 100)"
    };    

    CONFIG.Item.documentClass = LegendsItem;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("legends", itemSheet, {makeDefault: true});

    CONFIG.Actor.documentClass = LegendsCharacter;

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
});