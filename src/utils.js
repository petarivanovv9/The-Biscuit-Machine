"use strict";

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};


const rotateToRight = (arr) => {
    arr.unshift(...arr.splice(-1));
};


module.exports = {
    sleep,
    rotateToRight,
};
