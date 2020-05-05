"use strict";

const { rotateToRight } = require('./utils');


describe('rotateToRight', () => {
    describe('should rotate array elements with 1 position to the right and set 1st element to null', () => {
        test('', () => {
            const array = [5, 2, 3, 7, 5, 6];

            const expected_array = [null, 5, 2, 3, 7, 5];

            rotateToRight(array);

            expect(array).toEqual(expected_array);
        });

        test('', () => {
            const array = [null];

            const expected_array = [null];

            rotateToRight(array);

            expect(array).toEqual(expected_array);
        });
    });
});
