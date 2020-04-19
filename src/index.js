"use strict";

const repl = require('repl');

const { machineEvents } = require("./events");

const {
    SWITCH_ON_EVENT,
    SWITCH_PAUSE_EVENT,
    SWITCH_OFF_EVENT,
} = require("./constants");

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
        machineEvents.emit(SWITCH_ON_EVENT);
    }

    pause() {
        console.log("\n--- Machine has been PAUSED.");
        machineEvents.emit(SWITCH_PAUSE_EVENT);
    }

    off() {
        console.log("\n--- Machine has been turned OFF.");
        machineEvents.emit(SWITCH_OFF_EVENT);
    }
}


const bm = new BiscuitMachine();


repl.start('> ').context.bm = bm;
