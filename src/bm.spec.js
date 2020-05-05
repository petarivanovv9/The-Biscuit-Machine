"use strict";

const { machineEvents } = require("./events");

const { BiscuitMachine } = require("./bm");

const {
    SWITCH_ON_EVENT,
    SWITCH_PAUSE_EVENT,
    SWITCH_OFF_EVENT,
} = require("./constants");


describe('BiscuitMachine', () => {
    describe('on', () => {
        test('should emit SWITCH_ON_EVENT', () => {
            machineEvents.emit = jest.fn();

            const bm = new BiscuitMachine();

            bm.on();

            expect(machineEvents.emit).toHaveBeenCalledWith(SWITCH_ON_EVENT);
        });
    });

    describe('pause', () => {
        test('should emit SWITCH_PAUSE_EVENT', () => {
            machineEvents.emit = jest.fn();

            const bm = new BiscuitMachine();

            bm.pause();

            expect(machineEvents.emit).toHaveBeenCalledWith(SWITCH_PAUSE_EVENT);
        });
    });

    describe('off', () => {
        test('should emit SWITCH_OFF_EVENT', () => {
            machineEvents.emit = jest.fn();

            const bm = new BiscuitMachine();

            bm.off();

            expect(machineEvents.emit).toHaveBeenCalledWith(SWITCH_OFF_EVENT);
        });
    });
});
