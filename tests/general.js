'use strict';
const assert = require('assert');

const anArray = require('../PhyBioJS/array_class');

let phi = anArray.Zeros(10, 10);
let psi = anArray.Random(10, 10);

describe('Array definition tests', () => {
    it('should return true', () => {
        assert.equal(phi, phi);
    });
    it('should return true', () => {
        assert.equal(psi, psi);
    });
});