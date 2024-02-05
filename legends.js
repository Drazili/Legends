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