/*
    Module which contains the Oven Device implementation.
*/
"use strict";

const { machineEvents } = require("./events");

const { delay } = require("./utils");

const {
    OVEN_READY_EVENT,
    OVEN_ON_EVENT,
    OVEN_OFF_EVENT,

    MOTOR_PAUSE_EVENT,

    PULSE_EVENT,
    PULSE_OVEN_EVENT,
} = require("./constants");


const { ConveyorBelt } = require("./motor");


class Oven {
    _ZERO_COOKING_TEMPERATURE = 0;
    _MIN_COOKING_TEMPERATURE = 220;
    _MAX_COOKING_TEMPERATURE = 240;

    _FIRST_OVEN_POSITION_ON_CONVEYOR = 3;
    _SECOND_OVEN_POSITION_ON_CONVEYOR = 4;

    _TEMPERATURE_INCREASE = 5;

    constructor() {
        this._temperature = 0;
        this._automaticHeater = false;
        this._is_motor_paused = false;

        this.heating_element = false;

        machineEvents.on(OVEN_ON_EVENT, this.on.bind(this));
        machineEvents.on(OVEN_OFF_EVENT, this.off.bind(this));

        machineEvents.on(MOTOR_PAUSE_EVENT, this.pause.bind(this));

        machineEvents.on(PULSE_EVENT, this.performAction.bind(this));
        machineEvents.on(PULSE_OVEN_EVENT, this.performAction.bind(this));

        machineEvents.on("_ovenAutoHeater", this._autoHeater.bind(this));
    }

    performAction() {
        console.log("--- Oven >>> performAction");

        if (ConveyorBelt[this._FIRST_OVEN_POSITION_ON_CONVEYOR]) {
            ConveyorBelt[this._FIRST_OVEN_POSITION_ON_CONVEYOR] += `bake..${this._temperature}..`;
        }

        if (ConveyorBelt[this._SECOND_OVEN_POSITION_ON_CONVEYOR]) {
            ConveyorBelt[this._SECOND_OVEN_POSITION_ON_CONVEYOR] += `bake..${this._temperature}..`;
        }
    }

    async on() {
        console.log("\n--- Oven has been turned ON.");

        this.heating_element = true;
        this._automaticHeater = true;
        this._is_motor_paused = false;

        this._startHeater()
        .then(() => {
            if (this._isTemperatureWithinWorkingLimits()) {
                if (!this._is_motor_paused) {
                    machineEvents.emit(OVEN_READY_EVENT);
                }

                machineEvents.emit("_ovenAutoHeater");
            }
        });
    }

    pause() {
        this._is_motor_paused = true;
    }

    async off() {
        console.log("\n--- Oven has been turned OFF.");

        this.heating_element = false;
        this._automaticHeater = false;

        this._is_motor_paused = false;

        this._stopHeater();
    }

    async _startHeater() {
        while (this.heating_element && this._temperature < this._MAX_COOKING_TEMPERATURE) {
            this._temperature += this._TEMPERATURE_INCREASE;

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
                this._temperature -= this._TEMPERATURE_INCREASE;
            }

            if (this._automaticHeater && this._temperature > this._MIN_COOKING_TEMPERATURE) {
                this._temperature -= this._TEMPERATURE_INCREASE;
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

    _isTemperatureWithinWorkingLimits() {
        return this._temperature >= this._MIN_COOKING_TEMPERATURE && this._temperature <= this._MAX_COOKING_TEMPERATURE;
    }
}


module.exports = {
    Oven,
};
