"use strict";

const { Oven } = require("./oven");

const { ConveyorBelt } = require("./motor");

const { machineEvents } = require("./events");


describe('OvenDevice', () => {
    describe('on', () => {
        it('should start the heater', () => {
            const ovenDevice = new Oven();

            ovenDevice._startHeater = jest.fn();

            ovenDevice.on();

            expect(ovenDevice._startHeater).toHaveBeenCalled();
        });
    });

    describe('off', () => {
        it('should stop the heater', () => {
            const ovenDevice = new Oven();

            ovenDevice._stopHeater = jest.fn();

            ovenDevice.off();

            expect(ovenDevice._stopHeater).toHaveBeenCalled();
        });
    });

    describe('_autoHeater', () => {
        it('should stop heater if temperature has reached 240', () => {
            const ovenDevice = new Oven();
            ovenDevice._automaticHeater = true;
            ovenDevice._temperature = 240;

            ovenDevice._stopHeater = jest.fn();

            ovenDevice._autoHeater();

            expect(ovenDevice._stopHeater).toHaveBeenCalled();
        });

        it('should start heater if temperature has reached 220', () => {
            const ovenDevice = new Oven();
            ovenDevice._automaticHeater = true;
            ovenDevice._temperature = 220;

            ovenDevice._startHeater = jest.fn();

            ovenDevice._autoHeater();

            expect(ovenDevice._startHeater).toHaveBeenCalled();
        });
    });

    describe('_stopHeater', () => {
        it('should decrease the temperature with 5 if autoHeater is off', () => {
            const ovenDevice = new Oven();
            ovenDevice.heating_element = false;
            ovenDevice._temperature = 240;

            ovenDevice._stopHeater();

            expect(ovenDevice._temperature).toEqual(235);
        });

        it('should decrease the temperature with 5 if autoHeater is on', () => {
            const ovenDevice = new Oven();
            ovenDevice.heating_element = false;
            ovenDevice._temperature = 240;
            ovenDevice._automaticHeater = true;

            ovenDevice._stopHeater();

            expect(ovenDevice._temperature).toEqual(235);
        });

        it('should start turn on the heater if autoHeater is on', () => {
            const ovenDevice = new Oven();
            ovenDevice.heating_element = false;
            ovenDevice._temperature = 220;
            ovenDevice._automaticHeater = true;

            machineEvents.emit = jest.fn();

            ovenDevice._stopHeater();

            expect(machineEvents.emit).toHaveBeenCalled();
        });
    });

    describe('_isTemperatureWithinWorkingLimits', () => {
        const ovenDevice = new Oven();

        it('should return False if temperature is 210', () => {
            ovenDevice._temperature = 210;

            expect(ovenDevice._isTemperatureWithinWorkingLimits()).toBeFalsy();
        });

        it('should return True if temperature is 220', () => {
            ovenDevice._temperature = 220;

            expect(ovenDevice._isTemperatureWithinWorkingLimits()).toBeTruthy();
        });

        it('should return True if temperature is 240', () => {
            ovenDevice._temperature = 240;

            expect(ovenDevice._isTemperatureWithinWorkingLimits()).toBeTruthy();
        });
    });

    describe('performAction', () => {
        it('should bake the first biscuit under the Oven', () => {
            const biscuit = 'random..1..';
            ConveyorBelt[3] = biscuit;

            const expectetResult = biscuit + 'bake..0..';

            const ovenDevice = new Oven();
            ovenDevice.performAction();

            expect(ConveyorBelt[3]).toEqual(expectetResult);
        });

        it('should bake the second biscuit under the Oven', () => {
            const biscuit = 'random..2..';
            ConveyorBelt[4] = biscuit;

            const expectetResult = biscuit + 'bake..0..';

            const ovenDevice = new Oven();
            ovenDevice.performAction();

            expect(ConveyorBelt[4]).toEqual(expectetResult);
        });
    });
});
