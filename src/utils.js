"use strict";

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};


const rotateToRight = (arr) => {
    arr.unshift(...arr.splice(-1));
};


module.exports = {
    delay,
    rotateToRight,
};
