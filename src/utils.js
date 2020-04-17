'use strict';

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};


const rotate = (arr, k) => {
    if (arr.length > k ) {
        arr.unshift(...arr.splice(-k));
    } else {
        let i = 0;
        while (i < k) {
            arr.unshift(arr.splice(-1));
            i++;
        }
    }
    return arr;
};


module.exports = {
    sleep,
    rotate,
};
