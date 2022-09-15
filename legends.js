import powerSheet from "./module/sheets/powerSheet.js";
import character from "./module/documents/character.js";
import characterSheet from "./module/sheets/characterSheet.js";

// Hooks.on("renderCombatTracker", (app, html, data) => {
//     console.log("!!!!!!");
//     console.log(data.combats);
// });

Hooks.once("init", function(){
    console.log("Legends | Initializing legends");
    // console.log(CombatEncounters);
    // console.log(Actors);
    // console.log(Items);
    // console.log(Game);
    // console.log(data.combats);
    // console.log(system.combats);

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("legends", powerSheet, {makeDefault: true});

    CONFIG.Actor.documentClass = character;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("legends", characterSheet, {makeDefault: true});
});