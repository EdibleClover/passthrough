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
        } else if (str.match(/\d,,,[\w\d\D\s]{1},,,-?\d/)) {
            return 'Passthroughs must be separated by at least 2 bytes'
        } else if (str.match(/^,,,-?\d+,,,|,,,-?\d+,,,$/)) {
            return "cannot start or end with a passthrough"
        }
        else {
            return 'valid'
        }
    }
    /**
     * Escape regex Characters
     *  string
     */
    escape = () => {
        let str = this.passthrough
        let Re = /[\\.*+?^${}()|\]\[]/g
        let res = str.replace(Re, (x) => {
            return '\\' + x
        })
        console.warn(res)
        return res
    }
    /**
     * Return the passthrough statements transformed to Regex
     *  replaces passthroughs with wildcaRD
     * To Do
     * Add support for more specific delimiters  ,,,30-100,,,
     * 
     * So this actually generates a syntax error \ at end of pattern if a trailing ( is at the end of the search
     * Oddly enough this doesn't seem to cause a problem after running build
     */
    toRegex = (str) => {
        if (!str) { str = this.escape() }  //This is stupid,
        let Re = /(?:,,,(-)?(\d{0,5}),,,)/g
        let res = str.replace(Re, (x, m1, m2) => {
            if (m1 === '-') {
                return ")(.{0," + m2 + "})("  //replaced 
            }
            else {
                return ")(.{" + m2 + "," + m2 + "})("
            }
        })                                                  
        //now lets wrap the regex with additional capture groups   
        //We can capture everything else to get index of passthroughs (since the regex match doesn't contain indexs for captures)
        let wrapped = `(${res})`
        let regObj = {"regex":'',"passPositions":[]}
        //remove trailing () if necessary
        let fixxed = 
        ( wrapped.endsWith("()") ) ? 
        wrapped.substr(0, wrapped.length-2) : wrapped
        //Create the regex
        const myRegex = new RegExp(fixxed, 'i')
        //Assign to my Ob
        console.log(myRegex)
        return  myRegex//Messing with this removed G to get capture groups
    }
    /** 
     * 
     * Returns an object containing all the start and end values for
     * passthroughs and highlighting in the text editor
     * 
     */
    GenerateCoordinates = (result) =>{
        //index of my match in the srting
        let matchIndex = result.index
        //remove the first group, its the entire match, we're interested in captured groups
        let capturedStuff = result.slice(1)
        // we can assume that the passthroughs are the even captures
        let coordinates = {passThroughs:[],"verbose":[]}
        let movingAnchor = matchIndex
        capturedStuff.forEach( (capture, i) =>{
              //Lets get the index of all group 
            if(i/2 % 1 !== 0){   //If the index is odd (since it starts at 0)
                coordinates.passThroughs.push({
                    "start":movingAnchor,
                    "end": capture.length+movingAnchor
                })
            }else {
                coordinates.verbose.push({
                    "start":movingAnchor,
                    "end": capture.length+movingAnchor
                })
            }
            //Move Along!
            movingAnchor = capture.length + movingAnchor
        })
        return coordinates
    }
}