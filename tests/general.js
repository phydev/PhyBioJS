'use strict';

const anArray = require('../PhyBioJS/phybio.js');

let phi = anArray.Zeros(10, 10);
let psi = anArray.Random(10, 10);

console.log("Travis-ci testing");
if(phi===phi){
    console.log("M x N zeroes array . . . ok!");
}

if(psi===psi){
    console.log("M x N random array . . . ok!");
}