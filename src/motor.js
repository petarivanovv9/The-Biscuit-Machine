/*
    Module which contains the Motor, Extruder and Stamper
    Device implementations.
*/
"use strict";

const { machineEvents } = require("./events");

const { delay, rotateToRight } = require("./utils");

const {
    OVEN_READY_EVENT,

    MOTOR_PAUSE_EVENT,
    MOTOR_OFF_EVENT,
} = require("./constants");


const ConveyorBelt = Array(6).fill(null);
const ReadyBiscuits = new Array();


class Motor {
    constructor() {
        this._revolutions = 0;
        this._is_working = false;
        this._should_stop_motor = false;
        this._should_send_pulse_stamper = false;

        machineEvents.on(OVEN_READY_EVENT, this.on.bind(this));
        machineEvents.on(MOTOR_PAUSE_EVENT, this.pause.bind(this));
        machineEvents.on(MOTOR_OFF_EVENT, this.off.bind(this));

        this.extruder = new Extruder();
        this.stamper = new Stamper();
    }

    on() {
        console.log("\n--- Motor has been turned ON.");

        this._is_working = true;
        this._should_stop_motor = false;
        this._should_send_pulse_stamper = false;

        this._start();
    }

    pause() {
        console.log("\n--- Motor has been turned OFF.");

        this._is_working = false;
    }

    off() {
        console.log("\n--- Motor has been turned OFF.");

        if (this._revolutions === ReadyBiscuits.length) {
            this._stopMotorAndOven();
            return;
        }

        this._should_stop_motor = true;
        this._should_send_pulse_stamper = true;

        if (!this._is_working) {
            this._is_working = true;
            this._start();
        }
    }

    async pulse() {
        machineEvents.emit("pulse");

        await delay(5000);
    }

    async _start() {
        while (this._is_working) {
            if (!this._should_stop_motor && this._is_working) {
                await this.pulse();

                this._revolutions += 1;
            } else {
                if (this._should_send_pulse_stamper) {
                    machineEvents.emit("pulseStamper");
                    this._should_send_pulse_stamper = false;
                }
                machineEvents.emit("pulseOven");
            }

            let last_biscuit = ConveyorBelt[5];

            // shift all biscuits 1 position to the right
            rotateToRight(ConveyorBelt);

            ConveyorBelt[0] = null;

            if (last_biscuit) ReadyBiscuits.push(last_biscuit);

            console.log("\n--- Revolution:");
            console.log("--- On Conveyor: ", ConveyorBelt);
            console.log("--- Ready Biscuits: ", ReadyBiscuits);

            await delay(5000);

            if (this._should_stop_motor && this._revolutions === ReadyBiscuits.length) {
                this._stopMotorAndOven();
            }
        }
    }

    _stopMotorAndOven() {
        this._is_working = false;
        machineEvents.emit("ovenOff");
    }
}


class Extruder {
    constructor() {
        machineEvents.on("pulse", this.performAction.bind(this));
    }

    performAction() {
        console.log("--- Extruder >>> performAction");
        ConveyorBelt[0] = "..B..e..";
    }
}


class Stamper {
    constructor() {
        machineEvents.on("pulse", this.performAction.bind(this));
        machineEvents.on("pulseStamper", this.performAction.bind(this));
    }

    performAction() {
        console.log("--- Stamper >>> performAction");

        if (ConveyorBelt[1]) {
            ConveyorBelt[1] += "s..";
        }
    }
}


module.exports = {
    Motor,

    ConveyorBelt,
};
