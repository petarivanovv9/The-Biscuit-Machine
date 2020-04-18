"use strict";

const repl = require('repl');

const { machineEvents } = require("./events");

const { Switch } = require("./switch");
const { Oven } = require("./oven");
const { Motor } = require("./motor");


class BiscuitMachine {
    constructor() {
        this.switch = new Switch();
        this.oven = new Oven();
        this.motor = new Motor();
    }

    on() {
        console.log("\n--- Machine has been turned ON.");
        machineEvents.emit("switchOn");
    }

    pause() {
        console.log("\n--- Machine has been PAUSED.");
        machineEvents.emit("switchPause");
    }

    off() {
        console.log("\n--- Machine has been turned OFF.");
        machineEvents.emit("switchOff");
    }
}


const bm = new BiscuitMachine();


repl.start('> ').context.bm = bm;
