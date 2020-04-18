/*
    Module which contains helper utility functions.
*/
"use strict";


const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

/*
    Rotates all array's elements with 1 position to the right.
    NB: Mutates the original array.
*/
const rotateToRight = (arr) => {
    arr.unshift(...arr.splice(-1));
};


module.exports = {
    delay,
    rotateToRight,
};
