export default class passThrough {
    constructor(sig, text) {
        this.sig = sig
        this.text = text
        this.regex = this.toRegex(sig);
        this.decorations = this.generateDecorations(text)
    }
    generateExact = () => {
        const lengths = []
        const sigParts = this.sig.split(/,,,.{1,6},,,/)
        this.decorations.forEach((d)=>{
            if (d.mark.type === "Passthrough"){   lengths.push(d.focus.offset - d.anchor.offset)  }
        })
        console.log(lengths)
        console.log(sigParts)
        let exact = ``
        sigParts.forEach((p, i) => {
            let next  = (!lengths[i]) ? `${p}` : `${p},,,-${lengths[i]},,,`
            exact += next;     
        })
        return exact
    }
    /**
     * Return the passthrough statements transformed to Regex
     */
    toRegex = (str) => {
        let re = /([\]\[\(\)\/\\\.\+\?\^\$\}\{\*\|])/g
        let escaped = str.replace(re, (x) => {
            return '\\' + x
        })
        let Re = /(?:,{3}(\\\*|(\d{0,5})(-)?(\d{0,5})),{3})/g  //Find ,,,*,,, | ,,,-?\d,,, | ,,,\d-\d
        let res = escaped.replace(Re, (x, m1, m2, m3, m4) => {
            if (x.match(/^,{3}\d{0,5},{3}/)) {
                return `)(.{${m1}})(`
            }
            else if (x.startsWith(",,,-")) {
                return `)(.{0,${m4}})(`
            }
            else if (x.match(/^,{3}\d+-/)) {
                return `)(.{${m2},${m4}})(`
            }
            else if (x.match(/,{3}\\\*,{3}/)) {
                return ")(.*?)("   //greedy or not? Need to check this
            }
        })
        let wrapped = `(${res})`
        try {
            const myRegex = new RegExp(wrapped, 'i')
            return myRegex
        } catch (e) {
            console.warn(e)
            return e
        }
    }
    /**
     * returns all the decorations points for passing to Slate Editor        
     */
    generateDecorations = (text) => {
        const re = this.regex
        const decorations = []
        text.forEach(node => {
            const { key, text } = node
            let regexMatch = text.match(re);
            //If theres a match render some marks
            if (regexMatch != null) {
				/**
				 * check for an exact match. ie, no passthroughs, only the highlight mark 
				 */
                if (regexMatch.length === 2) {  //This is an exact match, there are no other matches in the array
                    let anchor = regexMatch.index;
                    let focus = anchor + regexMatch[0].length
                    decorations.push({
                        anchor: { key, offset: anchor },
                        focus: { key, offset: focus },
                        mark: { type: 'highlight' },
                    })
                }
                else {
                    //Pass RegexMatch to generate coordinates for highlight
                    let Coordinates = this.GenerateCoordinates(regexMatch)
                    Coordinates.passThroughs.forEach((c) => {
                        decorations.push({
                            anchor: { key, offset: c.start },
                            focus: { key, offset: c.end },
                            mark: { type: 'Passthrough' },
                        })
                    })
                    Coordinates.verbose.forEach((c) => {
                        decorations.push({
                            anchor: { key, offset: c.start },
                            focus: { key, offset: c.end },
                            mark: { type: 'highlight' },
                        })
                    })
                }
            }
            return decorations
        })
        return decorations
    }
    /**
    * Returns an object containing all the start and end values for
    * passthroughs and highlighting in the text editor
    */
    GenerateCoordinates = (result) => {
        //index of my match in the srting
        let lengths = []
        let matchIndex = result.index
        //remove the first group, its the entire match, we're interested in captured groups
        let capturedStuff = result.slice(1)
        let coordinates = { passThroughs: [], "verbose": [] }
        let movingAnchor = matchIndex
        capturedStuff.forEach((capture, i) => {
            if (i % 2 !== 0) {
               lengths.push(capture.length)
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
            movingAnchor = capture.length + movingAnchor
        })
        return coordinates
    }
}