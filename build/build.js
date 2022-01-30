const fs = require('fs');
const handlebars = require('handlebars');

// Function for returning the type of Element for use as class in stylesheet
const ElementTypes = {
    'Transition Metals': 'transitionmetal',
    'Alkali Metals': 'alkali',
    'Post Transition Metals': 'posttransition',
    'Halogens': 'halogens',
    'Noble Gas': 'noblegas',
    'Non-Metal': 'nonmetals',
    'Actinides': 'actinides',
    'Lanthanides': 'lanthanides',
    'Metalloids': 'metalloids',
    'Alkali Earths Metals': 'alkaliearth'
};

// Read Element Data files in Element folder and add into array
const ElementDataArray = [];
for (let i = 1; i <= 118; i++) {
    // Read Element.JSON Files
    const formattedFilePath = ('00' + i.toString()).slice(-3);
    const path = `./build/Elements/Element_${formattedFilePath}.json`;
    const elementFile = fs.readFileSync(path).toString();

    // Parse JSON
    const element = JSON.parse(elementFile);
    // Add Complete Element Data to Array for Saving
    ElementDataArray.push(element);
}

// Partial Element Data to Array for Generation of HTML
const ElementData = ElementDataArray.map((element) => {
    return {
        Symbol: element.Symbol,
        Name: element.Name,
        AtomicNumber: element['Atomic Number'],
        Mass: element.Mass,
        type: ElementTypes[element.Classification]
    };
});

// Use HandleBars to compile HTML using Name, Number, Mass and Classification
const sourceHTML = fs.readFileSync('./build/index.html').toString();
const combinedHTML = handlebars.compile(sourceHTML)({ Element: ElementData });
fs.writeFile('dist/index.html', combinedHTML.toString(), (err) => {
    if (err) {
        return console.error(err);
    }
});

// Save info.js
const text = 'var elementinfo = ' + JSON.stringify(ElementDataArray);
fs.writeFile('dist/assets/info.js', text, (err) => {
    if (err) {
        return console.error(err);
    }
});
