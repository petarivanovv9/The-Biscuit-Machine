"use strict";

const { machineEvents } = require("./events");

const { sleep, rotate } = require("./utils");


const ConveyorBelt = Array(6).fill(null);
const Result = new Array();


class Motor {
    constructor() {
        this._working = false;

        this._should_stop_motor = false;

        this._should_send_pulse_stamper = false;

        this._count_pulses = 0;

        machineEvents.on("ovenReady", this.on.bind(this));
        machineEvents.on("motorPause", this.lightOff.bind(this));
        machineEvents.on("motorOff", this.off.bind(this));

        this.extruder = new Extruder();
        this.stamper = new Stamper();
    }

    on() {
        console.log("\n >> Motor has been turned ON.");

        this._working = true;

        this._should_stop_motor = false;

        this._should_send_pulse_stamper = false;

        this._start();
    }

    lightOff() {
        console.log("\n >> Motor has been turned OFF [[ lightOff ]].");

        this._working = false;
    }

    off() {
        console.log("\n >> Should stop Motor when Conveyor is empty [[ off ]].");

        this._should_stop_motor = true;

        this._should_send_pulse_stamper = true;

        if (this._count_pulses !== Result.length) {
            console.log("... ConveyorBelt is not EMPTY ...");
        } else {
            console.log("... ConveyorBelt is EMPTY ...");

            machineEvents.emit("ovenOff");
        }

        if (!this._working) {
            this._working = true;
            this._start();
        }
    }

    async pulse() {
        machineEvents.emit("pulse");

        await sleep(5000);
    }

    async _start() {
        while (this._working) {
            if (!this._should_stop_motor && this._working) {
                await this.pulse();
                this._count_pulses += 1;
            } else {
                if (this._should_send_pulse_stamper) {
                    machineEvents.emit("pulseStamper");
                    this._should_send_pulse_stamper = false;
                }

                machineEvents.emit("pulseOven");

                await sleep(5000);
            }

            console.log("...before shift ... ConveyorBelt ... ", ConveyorBelt);

            if (ConveyorBelt[5]) {
                Result.push(ConveyorBelt[5]);

                console.log("... Result ... ", Result);

                rotate(ConveyorBelt, 1);

                ConveyorBelt[0] = null;

                console.log("...after shift ... ConveyorBelt ... ", ConveyorBelt);

                continue;
            }

            // shift all biscuits 1 position to the right
            rotate(ConveyorBelt, 1);

            console.log("...after shift ConveyorBelt ... ", ConveyorBelt);


            if (this._should_stop_motor && this._count_pulses === Result.length) {
                console.log("...OOOO .... ConveyorBelt is EMPTY ...");

                this._working = false;
                this._should_stop_motor = false;

                machineEvents.emit("ovenOff");
            }

        }
    }

}

class Extruder {
    constructor() {
        machineEvents.on("pulse", this.performAction.bind(this));
    }

    performAction() {
        console.log("\n Extruder >> performAction ...");

        ConveyorBelt[0] = "..B..1..";
    }
}


class Stamper {
    constructor() {
        machineEvents.on("pulse", this.performAction.bind(this));

        machineEvents.on("pulseStamper", this.performAction.bind(this));
    }

    performAction() {
        console.log("\n Stamper >> performAction ...");

        if (ConveyorBelt[1]) {
            ConveyorBelt[1] += "2..";
        }
    }
}



module.exports = {
    Motor,

    ConveyorBelt,
};
