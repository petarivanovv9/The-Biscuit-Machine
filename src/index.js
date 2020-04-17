'use strict'

const { machineEvents } = require('./events');

// const { createConveyor } = require('./conveyor');

const { Oven } = require('./oven');
const { Motor } = require('./motor');


class BiscuitMachine {

    constructor() {
        this.switch = new Switch();
        this.oven = new Oven();
        this.motor = new Motor();
    }

    switchOn() {
        machineEvents.emit('switchOn');
    }

    switchPause() {
        machineEvents.emit('switchPause');
    }

    // switchOff() {
    //     machineEvents.emit('switchOff');
    // }
}


class Switch {

    constructor() {
        machineEvents.on('switchOn', this.on.bind(this));

        machineEvents.on('switchPause', this.pause.bind(this));

        // machineEvents.on('switchOff', this.off.bind(this));
    }

    on() {
        console.log('\n >> Machine has been turned ON.');

        machineEvents.emit('ovenOn');
    }

    pause() {
        console.log('\n >> Machine has been PAUSED.');

        machineEvents.emit('motorPause');
    }

    off() {
        console.log('\n >> Machine has been turned OFF.');

        machineEvents.emit('motorOff');
    }
}


const machine = new BiscuitMachine();
