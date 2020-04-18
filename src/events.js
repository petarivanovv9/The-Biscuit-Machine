/*
    Module which contains the machine events emitter.
*/
"use strict";

const EventEmitter = require("events").EventEmitter;

const machineEvents = new EventEmitter();


module.exports = {
    machineEvents,
};
