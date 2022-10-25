/*
 * @Author: Noscere 
 * @Email: noscere1978@gmail.com
 * @Date: 2022-10-24 21:26:16 
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-10-25 03:58:33
 * @Description: Mocha Test script for the boolean-searcher class
 */

// Testing importing individual class
const BooleanSearcher = require('../boolean-searcher');
// And testing importing the entire module
const booleanSearcherModule = require('../index.js');

const moduleName = 'boolean-searcher';
const className = `BooleanSearcher`;

var assert = require('assert');

describe(`${moduleName}`, function() {
    describe(`${moduleName}.${className}, booleanSearchModule = require('../index.js')`, function() {
        context(`#constructor() without arguments`, function() {
            it(`should return an empty, default, ${className} class`, function() {
                var booleanSearcher = new booleanSearcherModule.BooleanSearcher();
                assert(booleanSearcher instanceof booleanSearcherModule.BooleanSearcher);
                assert(!booleanSearcher.isReady(), `logic error: default (blank) searcher reports it is ready to search`);
            });
        });
    });
    
    describe(`${className} = require('../boolean-searcher')`, function() {
        context(`#constructor() without arguments`, function() {
            it(`should instantiate a default ${className} class`, function() {
                var booleanSearcher = new BooleanSearcher();
                assert(booleanSearcher instanceof BooleanSearcher);
                assert(!booleanSearcher.isReady(), `logic error: default (blank) booleanSearcher reports it is ready to search`);
            });
        });

        context(`#constructor() with a valid one-term search string`, function() {
            it(`should instantiate a ${className} ready to use`, function() {
                var booleanString = "Term";
                var searcher = new BooleanSearcher("", booleanString);
                assert(searcher instanceof BooleanSearcher, `searcher is not an instance of ${className}!`);
                assert(searcher.isReady(), `construction error: searcher is not ready to search`);
            });
        });

        context(`#constructor() with malformed boolean search string`, function() {

        });
    });
});
