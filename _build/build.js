/*global require, process, console*/
// Removal of strange characters - adapted from http://stackoverflow.com/questions/11305797/remove-zero-width-space-characters-from-a-javascript-string

// Init
var fs = require("fs");
var handlebars = require("handlebars");

// Function for returning the type of Element for use as class in stylesheet
function returnElementType(type) {
    if (type == "Transition Metals") {
        return "transitionmetal";
    }
    else if (type == "Alkali Metals") {
        return "alkali";
    }
    else if (type == "Post Transition Metals") {
        return "posttransition";
    }
    else if (type == "Halogens") {
        return "halogens";
    }
    else if (type == "Noble Gas") {
        return "noblegas";
    }
    else if (type == "Non-Metal") {
        return "nonmetals";
    }
    else if (type == "Actinides") {
        return "actinides";
    }
    else if (type == "Lanthanides") {
        return "lanthanides";
    }
    else if (type == "Metalloids") {
        return "metalloids";
    }
    else if (type == "Alkali Earths Metals") {
        return "alkaliearth";
    }
    return type;
}

// Read Element Data files in Element folder and add into array
console.log("Parsing Element Information");
var ElementData = [];
var ElementDataArray = [];
for (var i = 1; i <= 118; i++) {
    // Read Element.JSON Files
    var formattedfilenum = ("00" + i.toString()).slice(-3);
    var ElementFile = fs.readFileSync('./_build/Elements/Element_' + formattedfilenum + '.json').toString().replace(/[\uFEFF]/g, '');

    // Parse JSON
    var Element = JSON.parse(ElementFile);
    // Add Complete Element Data to Array for Saving
    ElementDataArray.push(Element.Symbol, Element.Name, Element['Atomic Number'], Element.Group, Element.Period, Element.Mass, Element.Classification, Element.Location, Element['Electron shell configuration'], Element['Electron subshell configuration'], Element['Ionisation energy'], Element['State at Room Temperature'], Element['Boiling Point'], Element['Melting Point'], Element.Isotopes, Element.Discovered, Element['Element Description']);
    // Add Partial Element Data to Array for Generation of HTML
    var Eletype = returnElementType(Element.Classification);
    ElementData.push({Symbol: Element.Symbol, Name: Element.Name, AtomicNumber: Element["Atomic Number"], Mass: Element.Mass, type: Eletype});
}

console.log("Generating index.html");
// Use HandleBars to compile HTML using gathered Name, Atomic Number, Mass and Classification properties
var source  = fs.readFileSync('./_build/_templates/index.html').toString();
var template = handlebars.compile(source);
var combinedhtml = template({"Element": ElementData});

console.log("Saving index.html");
// Save index.html
fs.writeFile('index.html',combinedhtml.toString(), function(err) {
    if (err) {
        return console.error(err);
    }
});

// Convert Array to String
function returnSaveString(DataArray) {
    var SaveString = "";
    for (var i = 0; i <= DataArray.length; i++) {
        if (DataArray[i] === null || DataArray[i] === undefined) {
            SaveString += ',';
            continue;
        }
        if (typeof DataArray[i] == 'number') {
            SaveString += DataArray[i];
        }
        else {
            SaveString += '"' + DataArray[i] + '"';
        }
        if (i !== DataArray.length) {
            SaveString += ",";
        }
    }
    return SaveString;
}

console.log("Saving info.js");
// Save info.js
fs.writeFile('assets/info.js','var elementinfo = [' + returnSaveString(ElementDataArray) + ']', function(err) {
    if (err) {
        return console.error(err);
    }
});

// Finish
console.log("Periodic - Build Finished\n");