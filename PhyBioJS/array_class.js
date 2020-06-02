'use strict';

class anArray {

    static Zeros(m, n){
        // this functions inits an array filled with zeros
        let newArray = [[]];

        for (var i = 0; i<m; i++){
            for(var j = 0; j<n; j++){
                newArray[i].push(0.0);
            }
            newArray.push([]);
        }
        return newArray;
    }

    static Random(m, n){
        // this functions inits an array with random elements
        let newArray = [[]];

        for (var i = 0; i<m; i++){
            for(var j = 0; j<n; j++){
                newArray[i].push(Math.random());
            }
            newArray.push([]);
        }
        return newArray;

    }
}

module.exports = anArray;