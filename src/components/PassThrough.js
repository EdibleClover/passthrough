export default class passThrough {
    constructor(passthrough) {
        this.passthrough = passthrough;
    }
    /**
     * checks passthrough validity
     * commas, quantifier, separation, start/end of string
     */
    validate = () => {
        let str = this.passthrough
        if (str.match(',,,,')) {
            return 'Too many commas found';
        } else if (str.match(',,,-,,,')) {
            return 'Missing quantifier';
        } else if (str.match(/\d,{3}}.{1},{3}-?\d/)) {
            return 'Passthroughs must be separated by at least 2 bytes'
        } else if (str.match(/^,{3}-?\d+,{3}}|,{3}-?\d+,{3}$/)) {
            return "cannot start or end with a passthrough"
        }
        else {
            return 'valid'
        }
    }
    /**
     * Escape regex Characters
     *  string
     *  There is a problem where even though a ( is escaped at the end of the string,  throws an error when converting to regex
     *                                                                                  SyntaxError: \ at end of pattern
     */
    escape = () => {
        let str = this.passthrough
        let re = /[\]\[\(\)\/\\\.\+\?\^\$\}\{]/g
        let re2 = /[^,]{3}\*[^,]{3}/
        //let re = /[\\.*+?^${}()|\]\[]/g
        let res = str.replace(re, (x) => {
            return '\\' + x
        })
        let res2 = res.replace(re2, (x) => {
            return '\\' + x
        })

        console.warn(res2)
        return res2
    }
    /**
     * Return the passthrough statements transformed to Regex
     * 
     */
    toRegex = (str) => {
        if (!str) { str = this.escape() }
        //Added all the functionality
        const Re = /(?:,{3}(\*|(\d{0,5})(-)?(\d{0,5})),{3})/g  //Find ,,,*,,, | ,,,-?\d,,, | ,,,\d-\d
        let res = str.replace(Re, (x, m1, m2, m3, m4) => {
            console.log(`match ${x}`)
            if (x.match(/^,{3}\d{0,5},{3}/)) {
                return `)(.{${m1}})(`
            }
            else if (x.startsWith(",,,-")) {
                return `)(.{0,${m4}})(`  //replaced 
            }
            else if (x.match(/^,{3}\d+-/)) {
                return `)(.{${m2},${m4}})(`
            }
            else if (x.startsWith(",,,*")) {
                return ")(.*?)("   //greedy or not? Need to check this
            }
        })
        //now lets wrap the regex with additional capture groups   
        //We can capture everything else to get index of passthroughs (since the regex match doesn't contain indexs for captures)
        let wrapped = `(${res})`
        let regObj = { "regex": '', "passPositions": [] }
        //remove trailing () if necessary
        let fixxed =
            (wrapped.endsWith("()")) ?
                wrapped.substr(0, wrapped.length - 2) : wrapped
        //Create the regex
        const myRegex = new RegExp(fixxed, 'i')
        //Assign to my Ob
        console.warn(myRegex)
        return myRegex
    }
    /** 
     * 
     * Returns an object containing all the start and end values for
     * passthroughs and highlighting in the text editor
     * 
     */
    GenerateCoordinates = (result) => {
        //index of my match in the srting
        let matchIndex = result.index
        //remove the first group, its the entire match, we're interested in captured groups
        let capturedStuff = result.slice(1)
        let coordinates = { passThroughs: [], "verbose": [] }
        let movingAnchor = matchIndex
        capturedStuff.forEach((capture, i) => {
            //Lets get the index of all group 
            if (i / 2 % 1 !== 0) {   //If the index is odd (since it starts at 0), this is cheating, we're assuming the search does not start with a passthrough, which would be illegal
                coordinates.passThroughs.push({
                    "start": movingAnchor,
                    "end": capture.length + movingAnchor
                })
            } else {
                coordinates.verbose.push({
                    "start": movingAnchor,
                    "end": capture.length + movingAnchor
                })
            }
            //Move Along!
            movingAnchor = capture.length + movingAnchor
        })
        return coordinates
    }
}