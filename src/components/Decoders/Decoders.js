


/**ripping off some of this junk for now */
/*

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

#Redoing this entire mess
Drop parsing php, and highlighting text, or at least disable by default

$$  Decoders I would like:
base64
\x
chr()
Concatanations with all the above 
formatting by \n ;
unPack Js && perhaps somekind of function hook




Remove Comments
url decode





$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$



/**Will handle setting the language selection and any decoding that is not language specific */
class UnTangler {

    hex = (string) => {
        return string.replace(/\\x([0-9A-Fa-f]{2})/gm, function () {
            return String.fromCharCode(parseInt(arguments[1], 16));
        });
    };
    fromChar = (char) => {
        return char.replace(/chr\(([0-9]{1,3})\)/gmi, function (a, b) {
            let x = String.fromCharCode(b)
            return "\"" + x + "\""   //To keep these as a string in teh original code
        })
    }
    fixConcats = (string) => {
        return string.replace(/["']\s*?\.\s*?["']/g, '')
    }
    //This seems odd
    removeBadChars = (string) => {
        let reg = /(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g;
        return string.replace(reg, '')
    }
    //Not in Use
    ConcatArraysManually = (string) => {
        return string
    }
    // Change this to just decode anything
    base64php = (string) => {
        try {
            return string.replace(/base64_decode\(['"](.*?)['"]\)/g, function (a, b) {
                let x = "'" + atob(b) + "'"
                return x
            });
        }catch(e){
            console.log("bad Base64")
            return "bad input!"
        }
    }
    base64 = (string) => {
        try{
            return atob(string)
        }catch(e){
            return e.toString()
        }
    }
    //Herm, this doesn't return Correctly....
    format = (string) => {
        return string.replace(/(;)/g, function (a, b) {
            let x = ";\r"
            return x
        });
    }


}
class Formatter extends UnTangler {
    constructor(language) {
        super(language)
    }

    // Add line breaks after ;
    hardFormat = (string) => {
        return string.replace(/(;)/g, function (a, b) {
            let x = ";\n"
            return x
        });
    }
}

export { UnTangler, Formatter }

/**
badChars = (string) => {
    let stripped = string.replace(/[^\x20-\x7E]/g, '');
    return stripped

}


fromChar = (string) => {
   //Removing lines isn't a great idea, need to find a way around this

    //let RLINE = /\s/gm
   // let singeLine = string.replace(RLINE, '')
    let regex = /chr\(([0-9]{2,3})\)/igs
    let good = string.replace(regex, function(matches,b){
       return String.fromCharCode(b)
    })
   return good
}


decodehex = (string) => {
  return string.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
      return String.fromCharCode(parseInt(arguments[1], 16));
  });
};
*/