const { Motor } = require('./motor');

const { machineEvents } = require('./events');

const {
    PULSE_EVENT,
    PULSE_STAMPER_EVENT,
    PULSE_OVEN_EVENT,

    OVEN_OFF_EVENT,
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

    describe('_start', () => {
        it('should execute a pulse, machine is on', () => {
            const motorDevice = new Motor();
            motorDevice._is_working = true;

            motorDevice.pulse = jest.fn();

            motorDevice._start();

            expect(motorDevice.pulse).toHaveBeenCalledTimes(1);
        });

        it('should send pulse to stamper and oven, machine has been turned off', () => {
            const motorDevice = new Motor();
            motorDevice._is_working = true;
            motorDevice._should_stop_motor = true;
            motorDevice._should_send_pulse_stamper = true;

            motorDevice.pulse = jest.fn();

            machineEvents.emit = jest.fn();

            motorDevice._start();
            motorDevice._start();

            expect(motorDevice.pulse).toHaveBeenCalledTimes(0);

            expect(machineEvents.emit).toHaveBeenNthCalledWith(1, PULSE_STAMPER_EVENT);
            expect(machineEvents.emit).toHaveBeenNthCalledWith(2, PULSE_OVEN_EVENT);
            expect(machineEvents.emit).toHaveBeenNthCalledWith(3, PULSE_OVEN_EVENT);
        });
    });

    describe('_stopMotorAndOven', () => {
        it('should execute a pulse, machine is on', () => {
            const motorDevice = new Motor();

            machineEvents.emit = jest.fn();

            motorDevice._stopMotorAndOven();

            expect(machineEvents.emit).toHaveBeenCalledWith(OVEN_OFF_EVENT);
        });
    });
});
