"use strict";


const { Oven } = require("./oven");

const { ConveyorBelt } = require("./motor");


const {

} = require("./constants");


describe('OvenDevice', () => {
    describe('performAction', () => {
        test('should bake the first biscuit under the Oven', () => {
            const biscuit = 'random..1..';
            ConveyorBelt[3] = biscuit;

            const expectetResult = biscuit + 'bake..0..';

            const ovenDevice = new Oven();
            ovenDevice.performAction();

            expect(ConveyorBelt[3]).toEqual(expectetResult);
        });

        test('should bake the second biscuit under the Oven', () => {
            const biscuit = 'random..2..';
            ConveyorBelt[4] = biscuit;

            const expectetResult = biscuit + 'bake..0..';

            const ovenDevice = new Oven();
            ovenDevice.performAction();

            expect(ConveyorBelt[4]).toEqual(expectetResult);
        });
    });

    describe('_isTemperatureWithinWorkingLimits', () => {
        const ovenDevice = new Oven();

        test('should return False if temperature is 210', () => {
            ovenDevice._temperature = 210;

            expect(ovenDevice._isTemperatureWithinWorkingLimits()).toBeFalsy();
        });

        test('should return True if temperature is 220', () => {
            ovenDevice._temperature = 220;

            expect(ovenDevice._isTemperatureWithinWorkingLimits()).toBeTruthy();
        });

        test('should return True if temperature is 240', () => {
            ovenDevice._temperature = 240;

            expect(ovenDevice._isTemperatureWithinWorkingLimits()).toBeTruthy();
        });
    });
});
