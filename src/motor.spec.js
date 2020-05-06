const { Motor } = require('./motor');

const { machineEvents } = require('./events');

const {
    PULSE_EVENT,
} = require('./constants');


describe('MotorDevice', () => {
    describe('on', () => {
        it('should start the Motor', () => {
            const motorDevice = new Motor();
            motorDevice._start = jest.fn();

            motorDevice.on();

            expect(motorDevice._start).toHaveBeenCalled();
        });
    });

    describe('off', () => {
        it('should call stopMotorAndOven when there are no biscuits on Conveyor', () => {
            const motorDevice = new Motor();
            motorDevice._stopMotorAndOven = jest.fn();

            motorDevice.off();

            expect(motorDevice._stopMotorAndOven).toHaveBeenCalled();
        });

        it('should not call stopMotorAndOven when there are biscuits on Conveyor', () => {
            const motorDevice = new Motor();
            motorDevice._revolutions = 1;
            motorDevice._stopMotorAndOven = jest.fn();

            motorDevice.off();

            expect(motorDevice._stopMotorAndOven).toHaveBeenCalledTimes(0);
        });

        it('should be working if Conveyor is not empty and Machine has been turned from pause to off', () => {
            const motorDevice = new Motor();
            motorDevice._revolutions = 1;
            motorDevice._is_working = false;
            motorDevice._start = jest.fn();

            motorDevice.off();

            expect(motorDevice._start).toHaveBeenCalled();
        });
    });

    describe('pulse', () => {
        it('should emit PULSE_EVENT', () => {
            const motorDevice = new Motor();

            machineEvents.emit = jest.fn();

            motorDevice.pulse();

            expect(machineEvents.emit).toHaveBeenCalledWith(PULSE_EVENT);
        });
    });
});
