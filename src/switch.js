/*
    Module which contains the Switch Device implementation.
*/
"use strict";

const { machineEvents } = require("./events");


class Switch {
    constructor() {
        machineEvents.on("switchOn", this.on.bind(this));
        machineEvents.on("switchPause", this.pause.bind(this));
        machineEvents.on("switchOff", this.off.bind(this));
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
