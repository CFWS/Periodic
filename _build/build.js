/*global require, process, console*/
/*jslint plusplus:true, continue:true, browser:true*/

// Removal of strange characters - adapted from
// http://stackoverflow.com/questions/11305797/

// Init
var fs = require("fs");
var handlebars = require("handlebars");

// Function for returning the type of Element for use as class in stylesheet
var ElementTypes = {"Transition Metals": "transitionmetal",
                    "Alkali Metals": "alkali",
                    "Post Transition Metals": "posttransition",
                    "Halogens": "halogens",
                    "Noble Gas": "noblegas",
                    "Non-Metal": "nonmetals",
                    "Actinides": "actinides",
                    "Lanthanides": "lanthanides",
                    "Metalloids": "metalloids",
                    "Alkali Earths Metals": "alkaliearth"};
function returnElementType(type) {
    "use strict";
    return ElementTypes[type];
}

// Read Element Data files in Element folder and add into array
console.log("Parsing Element Information");
var ElementData = [];
var ElementDataArray = [];
var i, element, formattedfilenum, ElementFile, Eletype;
var path;
for (i = 1; i <= 118; i++) {
    // Read Element.JSON Files
    formattedfilenum = ("00" + i.toString()).slice(-3);
    path = './_build/Elements/Element_' + formattedfilenum + '.json';
    ElementFile = fs.readFileSync(path).toString();

    // Parse JSON
    element = JSON.parse(ElementFile);
    // Add Complete Element Data to Array for Saving
    ElementDataArray.push(element);
    // Add Partial Element Data to Array for Generation of HTML
    Eletype = returnElementType(element.Classification);
    ElementData.push({Symbol: element.Symbol, Name: element.Name,
        AtomicNumber: element["Atomic Number"],
        Mass: element.Mass, type: Eletype});
}

// Use HandleBars to compile HTML using Name, Number, Mass and Classification
console.log("Generating index.html");
var source  = fs.readFileSync('./_build/_templates/index.html').toString();
var template = handlebars.compile(source);
var combinedhtml = template({"Element": ElementData});

// Save index.html
console.log("Saving index.html");
fs.writeFile('index.html', combinedhtml.toString(), function (err) {
    "use strict";
    if (err) {
        return console.error(err);
    }
});

// Save info.js
console.log("Saving info.js");
var text = 'var elementinfo =' + JSON.stringify(ElementDataArray);
fs.writeFile('assets/info.js', text, function (err) {
    "use strict";
    if (err) {
        return console.error(err);
    }
});

// Finish
console.log("Periodic - Build Finished\n");
