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

    static Circle(m, n, radius){

        let newArray = [[]];
        let r;

        for (var i = 0; i < m; i++) {
           for (var j = 0; j < n; j++) {
               r = Math.sqrt(Math.pow(m/2-i, 2) + Math.pow(n/2-j, 2));

               if (r <= radius) {
                   newArray[i].push(1.0);
               }
               else{
                   newArray[i].push(0.0);
               }

           }
           newArray.push([]);
        }
    return newArray;

    }
}

if(typeof process === 'object')
    module.exports = anArray;