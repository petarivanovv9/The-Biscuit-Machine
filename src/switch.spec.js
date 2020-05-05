"use strict";

const { machineEvents } = require("./events");

const { Switch } = require("./switch");

const {
    OVEN_ON_EVENT,
    MOTOR_PAUSE_EVENT,
    MOTOR_OFF_EVENT,
} = require("./constants");


describe('SwitchDevice', () => {
    describe('on', () => {
        test('should emit OVEN_ON_EVENT', () => {
            machineEvents.emit = jest.fn();

            const switchDevice = new Switch();
            switchDevice.on();

            expect(machineEvents.emit).toHaveBeenCalledWith(OVEN_ON_EVENT);
        });
    });

    describe('pause', () => {
        test('should emit MOTOR_PAUSE_EVENT', () => {
            machineEvents.emit = jest.fn();

            const switchDevice = new Switch();
            switchDevice.pause();

            expect(machineEvents.emit).toHaveBeenCalledWith(MOTOR_PAUSE_EVENT);
        });
    });

    describe('off', () => {
        test('should emit MOTOR_OFF_EVENT', () => {
            machineEvents.emit = jest.fn();

            const switchDevice = new Switch();
            switchDevice.off();

            expect(machineEvents.emit).toHaveBeenCalledWith(MOTOR_OFF_EVENT);
        });
    });
});
