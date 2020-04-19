/*
    Module which contains the Switch Device implementation.
*/
"use strict";

const { machineEvents } = require("./events");

const {
    SWITCH_ON_EVENT,
    SWITCH_PAUSE_EVENT,
    SWITCH_OFF_EVENT,
} = require("./constants");


class Switch {
    constructor() {
        machineEvents.on(SWITCH_ON_EVENT, this.on.bind(this));
        machineEvents.on(SWITCH_PAUSE_EVENT, this.pause.bind(this));
        machineEvents.on(SWITCH_OFF_EVENT, this.off.bind(this));
    }

    on() {
        machineEvents.emit("ovenOn");
    }

    pause() {
        machineEvents.emit("motorPause");
    }

    off() {
        machineEvents.emit("motorOff");
    }
}


module.exports = {
    Switch,
};
