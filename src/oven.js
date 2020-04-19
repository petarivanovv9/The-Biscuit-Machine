/*
    Module which contains the Oven Device implementation.
*/
"use strict";

const { machineEvents } = require("./events");

const { delay } = require("./utils");

const {
    OVEN_READY_EVENT,
} = require("./constants");


const { ConveyorBelt } = require("./motor");


class Oven {
    _ZERO_COOKING_TEMPERATURE = 0;
    _MIN_COOKING_TEMPERATURE = 220;
    _MAX_COOKING_TEMPERATURE = 240;

    constructor() {
        this._temperature = 0;
        this._automaticHeater = false;

        this.heating_element = false;

        machineEvents.on("ovenOn", this.on.bind(this));
        machineEvents.on("ovenOff", this.off.bind(this));

        machineEvents.on("pulse", this.performAction.bind(this));
        machineEvents.on("pulseOven", this.performAction.bind(this));

        machineEvents.on("_ovenAutoHeater", this._autoHeater.bind(this));
    }

    performAction() {
        console.log("--- Oven >>> performAction");

        if (ConveyorBelt[3]) {
            ConveyorBelt[3] += `bake..${this._temperature}..`;
        }

        if (ConveyorBelt[4]) {
            ConveyorBelt[4] += `bake..${this._temperature}..`;
        }
    }

    async on() {
        console.log("\n--- Oven has been turned ON.");

        this.heating_element = true;
        this._automaticHeater = true;

        this._startHeater()
        .then(() => {
            if (this._temperature >= this._MIN_COOKING_TEMPERATURE && this._temperature <= this._MAX_COOKING_TEMPERATURE) {
                machineEvents.emit(OVEN_READY_EVENT);

                machineEvents.emit("_ovenAutoHeater");
            }
        });
    }

    async off() {
        console.log("\n--- Oven has been turned OFF.");

        this.heating_element = false;
        this._automaticHeater = false;

        this._stopHeater();
    }

    async _startHeater() {
        while (this.heating_element && this._temperature < this._MAX_COOKING_TEMPERATURE) {
            this._temperature += 5;

            await delay(1500);

            if (this._temperature === this._MAX_COOKING_TEMPERATURE) {
                this.heating_element = false;

                machineEvents.emit("_ovenAutoHeater");
            }
        }
    }

    async _stopHeater() {
        while (!this.heating_element) {
            if (this._automaticHeater && this._temperature === this._MIN_COOKING_TEMPERATURE) {
                this.heating_element = true;

                machineEvents.emit("_ovenAutoHeater");

                continue;
            }

            if (!this._automaticHeater && this._temperature > this._ZERO_COOKING_TEMPERATURE) {
                this._temperature -= 5;
            }

            if (this._automaticHeater && this._temperature > this._MIN_COOKING_TEMPERATURE) {
                this._temperature -= 5;
            }

            await delay(1500);
        }
    }

    async _autoHeater() {
        if (this._automaticHeater) {
            if (this._temperature === this._MAX_COOKING_TEMPERATURE) {
                this.heating_element = false;
                await this._stopHeater();
            }

            if (this._temperature === this._MIN_COOKING_TEMPERATURE) {
                this.heating_element = true;
                await this._startHeater();
            }
        }
    }
}


module.exports = {
    Oven,
};
