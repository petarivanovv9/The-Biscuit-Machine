"use strict";

const { BiscuitMachine } = require('./src/bm');

const repl = require('repl');


const bm = new BiscuitMachine();


repl.start('> ').context.bm = bm;
