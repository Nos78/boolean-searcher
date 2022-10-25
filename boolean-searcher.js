/*
 * @Author: Noscere 
 * @Email: noscere1978@gmail.com
 * @Date: 2022-10-24 21:55:08 
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-10-25 03:59:44
 * @Description: BooleanSearcher class
 * Takes a given boolean search string and creates
 * a object that can be used to search any given piece
 * of text and return any matches against those
 * predefined terms.
 */
const uuId = require("uuid");
const winston = require('winston');
const customErrors = require('application-errors');
/*
var debugLevel;
var debug = typeof v8debug === 'object';
if(debug) {
    debugLevel = 'debug';
} else {
    debugLevel = 'error';
}*/

// Initialize the logger, with colored output
//logger.remove(logger.transports.Console);
//logger.add(new logger.transports.Console, {colorize: true});
//var logger = new (winston.Logger)({
//    transports: [
//      new (winston.transports.Console)({ level: `${debugLevel}` })//,
      //new (winston.transports.File)({ filename: 'somefile.log' })
//    ]
//  });
/*
// your centralized logger object
let logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({level: `${debugLevel}`, colorize: true}),
    ],
    exitOnError: false, // do not exit on handled exceptions
});

class BooleanSearcher {
    constructor(name = "", booleanString = "") {
        console.log("constructing");
    }
}
*/
class BooleanSearcher {
    // member properties
    #name = "";
    #uuid = "";
    #booleanString = "";
    #regexps = [];

    #booleanTerms = 0;  // A simple count of the number of boolean terms encountered in the given string
    #searchTerms = 0;   // A count of words/phrases in the given string - Eg non-boolean words (IE not AND OR NOT)

    #searches = 0;  // each AND & NOT will perform an additional search against a given piece of text
                    // whilst OR does not. A AND B OR C will require 2 searches. (This is [A AND [B OR C]])

    // construction
    constructor(name = "", booleanString = "") {
        // name this instance
        if(!name || name == "") {
            // defaults to class name
            name = this.constructor.name;
        }
        this.setName(name);
        //logger.debug(`Instance of ${this.constructor.name}.name = ${this.#name}`);
        this.#setUuid();
        //logger.debug(`Instance of ${this.constructor.name}.#uuid = ${this.getUuid()}`);
        //logger.debug(`Instance of ${this.constructor.name}.uniqueName = ${this.getUniqueName()}`);
        
        if(booleanString) {
            if(!this.setBooleanString(booleanString)) {
                throw new customErrors.IllegalArgumentError("Unable to process 'booleanString' parameter", booleanString);
            }
        }
    }

    // member methods
    isReady() {
        var success = false;
        if(this.#booleanString) {
            if(this.#regexps.length > 0) {
                success = true;
            }
        }
        return success;
    }

    // A note about getters and setters (or accessors and mutators)
    // I'm not a fan of arbitarily adding getters and setters for
    // every class property because the gods of OOP say it is so,
    // rather getters and setters should have sensible reasons for
    // existing... E.g. providing a setter, when the member-variable
    // ought to be read only then “encapsulation” bought nothing.
    // is the member a specialization of an abstract concept? A file on
    // Unix is quite abstract - from files on a hardisk, a device, to a
    // process, in memory file etc.
    //
    // Here, the getters and setters ensure members meet validation
    // critera/rules, trigger further logic (such as constructing the
    // regexps from boolean string), and/or encapsulate read-only
    // and otherwise private members. Set once at construction, should
    // never hence change. And so forth,... here endeth the lesson.

    // getters
    getName() {
        return this.#name;
    }

    getUniqueName() {
        return this.#name + this.#uuid;
    }

    getUuid() {
        return this.#uuid;
    }

    getBooleanString() {
        return this.#booleanString;
    }

    getSearchesCount() {
        return this.#searches;
    }

    getBooleanTermsCount() {
        return this.#booleanTerms;
    }

    getSearchTermsCount() {
        return this.#searchTerms;
    }

    getRegexpsCount() {
        return this.#regexps.length;
    }
    
    // setters
    setName(newName) {
        var success = false;
        if(newName && newName != "") {
            this.#name = newName;
            success = true;
        }
        return success;
    }

    setBooleanString(booleanString) {
        var success = false;
        if(booleanString) {
            this.#booleanString = booleanString;
            // parse the string into array of regular expressions
        }

        success = this.#setRegexps();
        return success;
    }

    // private setters
    #setUuid() {
        var uuid = "";
        // this method should only be called once!
        if(this.#uuid && this.#uuid != "") {
            // throw an exception
            throw new customErrors.IllegalOperationError(`Uuid already present`, `Illegal function call, ${this.constructor.name}#setUuid - Uuid already present.`);
        } else {
            uuid = uuId.v4();
        }

        this.#uuid = uuid;
        return uuid;
    }

    #setRegexps(boolStr = "") {
        var booleanString = boolStr;
        var success = false;
        if(!booleanString || booleanString == "") {
            // try member property
            if(this.#booleanString && this.#booleanString != "") {
                booleanString = this.#booleanString;
            } else {
                return false;
            }
            // split string into words
            var words = booleanString.split(" ");
            // TODO - What about quoted phrases?
            for (const word of words) {
                var regex = "";
                var completed = false;
                switch(word) {
                    case 'OR':
                        this.#booleanTerms++;
                        // Add regex operator and continue
                        regex += "|";
                        break;
                    case 'AND':
                        this.#booleanTerms++;
                        completed = true;
                        break;
                    case 'NOT':
                        this.#booleanTerms++;
                        // TODO
                        break;
                    default:
                        this.#searchTerms++;
                        // Make word a regex group
                        regex = `(.*${word}.*)`;
                }
                if(completed && regex != "") {
                    // TODO sanity check the regex string
                    this.#regexps.push(regex);
                    regex = "";
                    completed = false;
                }
            }
            if(regex != "") {
                // TODO sanity check regex string (as above)
                this.#regexps.push(regex);
            }

            if(this.#regexps.length > 0) {
                // TODO a better way to determine success
                success = true;
            }
            return success;
        }
    }
}

module.exports = BooleanSearcher;