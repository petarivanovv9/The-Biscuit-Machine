"use strict";

const { machineEvents } = require("./events");

const { sleep } = require("./utils");

const { ConveyorBelt } = require("./motor");


class Oven {
    _ZERO_COOKING_TEMPERATURE = 0;
    _MIN_COOKING_TEMPERATURE = 220;
    _MAX_COOKING_TEMPERATURE = 240;

    constructor() {
        this.heating_element = false;
        this._temperature = 0;

        machineEvents.on("ovenOn", this.on.bind(this));
        machineEvents.on("ovenOff", this.off.bind(this));

        machineEvents.on("pulse", this.performAction.bind(this));
        machineEvents.on("pulseOven", this.performAction.bind(this));
    }

    performAction() {
        console.log("\n Oven >> performAction ...");

        if (ConveyorBelt[3]) {
            ConveyorBelt[3] += "bake..3..";
        }

        if (ConveyorBelt[4]) {
            ConveyorBelt[4] += "bake..4..";
        }
    }

    temperature() {
        console.log("\n Current temperature: ", this._temperature);
    }

    async on() {
        console.log("\n >> Oven has been turned ON.");

        this.heating_element = true;

        this._startHeater()
        .then(() => {
            if (this._temperature >= this._MIN_COOKING_TEMPERATURE && this._temperature <= this._MAX_COOKING_TEMPERATURE) {
                console.log("\n ... Oven is ready.");

                machineEvents.emit("ovenReady");
            }
        });
    }

    async off() {
        console.log("\n >> Oven has been turned OFF.");

        this.heating_element = false;

        this._stopHeater();
    }

    async _startHeater() {
        // while (this.heating_element) {
        while (this.heating_element && this._temperature < this._MAX_COOKING_TEMPERATURE) {
            // if (this._temperature === this._MAX_COOKING_TEMPERATURE) {
            //     this.off();
            // }

            this._temperature += 5;

            await sleep(500);
        }
    }

    async _stopHeater() {
        while (!this.heating_element && this._temperature > this._ZERO_COOKING_TEMPERATURE) {
            // if (this._temperature === this._MIN_COOKING_TEMPERATURE) {
            //     this.on();
            // }

            this._temperature -= 5;

            await sleep(500);
        }
    }
}

module.exports = {
    Oven,
};
