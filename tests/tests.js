// const recipies = require('./index');
const scaleRecipies = {

    majScale: [2, 2, 1, 2, 2, 2, 1],
    minScale: [2, 1, 2, 2, 1, 2, 2],
    majPent: [2, 2, 3, 2],
    minPent: [3, 2, 2, 3],
    bluesScale: [3, 2, 1, 1, 3],
    dimishedScale: [1, 2, 1, 2, 1, 2, 1],
    alteredScale: [1, 2, 1, 2, 2, 2],
    jewishScale: [1, 3, 1, 2, 1, 2, 2]

}

const keySigns = {
    sharp: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    flat: ["C", "Db", "D", "Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"]
}

const scaleDegreeSharp = keySigns.sharp.indexOf("F#");
const scaleDegreeFlat = keySigns.flat.indexOf("Gb");
class allScales {
    constructor(keySigns, scaleDegree, scaleRecipe) {
        this.keySigns = keySigns;
        this.scaleDegree = scaleDegree;
        this.scaleRecipe = scaleRecipe;

    }

    scaleGenerator() {
        let { scaleDegree } = this;
        const { keySigns, scaleRecipe } = this;

        let scaleResult = [];
        // enharmonic exceptions for sharp

        while (keySigns[keySigns.length - 1] !== "Cb") {
            if (scaleDegree === 5) { keySigns[4] = "E"; };
            if (scaleDegree === 6) { keySigns[5] = "E#"; };
            if (scaleDegree === 1) {
                keySigns[5] = "E#"; keySigns[0] = "B#";
            };
            break;
        }

        ///M-mapa/// A-vector z interwalami w skali///R- vector wynikow
        for (let i = 0; i <= scaleRecipe.length; i++) {

            if (scaleDegree < 12) {

                scaleResult.push(keySigns[scaleDegree]); //c,
                scaleDegree = scaleDegree + scaleRecipe[i];

            }

            if (scaleDegree > 11) {

                scaleDegree = scaleDegree % 12; ///pryma-12(pryma minus wielkosc mapy)

            }

        }

        return scaleResult;
    }

    octaveGenerator() {
        const actual = this.scaleGenerator();
        let octave = 4;
        const indexC = actual.indexOf("C");
        const indexCsharp = actual.indexOf("C#");
        const indexCflat = actual.indexOf("Cb");
        const indexDflat = actual.indexOf("Db");
        const indexD = actual.indexOf("D");

        for (let i = 0; i < actual.length; i++) {
            if (octave === 4) {

                if (i === indexC || i === indexCsharp || i === indexCflat || i === indexDflat || (i === indexD && this.scaleRecipe.indexOf("3") === -1 && actual[0] !== actual[indexD])) {
                    octave++;

                }
            } else if (actual[i] === "C#" || actual[i] === "C" && i !== 0) {
                octave = 6;
            }
            actual[i] = `${actual[i]}/${octave}`;

        }
        return actual;
    }
}

// Making an scale object
const Scale = [
    new allScales(keySigns.sharp, scaleDegreeSharp, scaleRecipies.majScale),
    new allScales(keySigns.flat, scaleDegreeFlat, scaleRecipies.minScale),
    new allScales(keySigns.sharp, scaleDegreeSharp, scaleRecipies.majPent),
    new allScales(keySigns.flat, scaleDegreeFlat, scaleRecipies.minPent),
    new allScales(keySigns.sharp, scaleDegreeSharp, scaleRecipies.bluesScale),
    new allScales(keySigns.sharp, scaleDegreeSharp, scaleRecipies.dimishedScale),
    new allScales(keySigns.sharp, scaleDegreeSharp, scaleRecipies.alteredScale),
    new allScales(keySigns.sharp, scaleDegreeSharp, scaleRecipies.jewishScale)
]
let stringNotes = [];
for (let i = 0; i < Scale.length; i++) {

    stringNotes[i] = Scale[i].octaveGenerator();
}



// My  function to generate accidentals for notes in vexflow
function notesNotation(stringNotes) {
    let notes = [];

    for (let i = 0; i < stringNotes.length; i++) {
        if (stringNotes[i].indexOf("#") !== -1 || stringNotes[i].indexOf("b") !== -1) {
            notes.push(new VF.StaveNote({ clef: "treble", keys: [stringNotes[i]], duration: "w" }).addAccidental(0, new VF.Accidental(stringNotes[i][1]))); //index1 is always an accidantal in this case
        }
        else if (stringNotes[i].indexOf("#") === -1 || stringNotes[i].indexOf("b") === -1) {
            notes.push(new VF.StaveNote({ clef: "treble", keys: [stringNotes[i]], duration: "w" }));

        }
    }

    for (let i = 0; i < notes.length - 1; i++) {
        //Checks if there is appearence of "natural - accidental" 
        if (notes[i].keys[0][0] === notes[i + 1].keys[0][0] && Scale[i].keySigns.lastIndexOf("B") === -1) {

            notes[i + 1] = notes[i + 1].addAccidental(0, new VF.Accidental("n"));
        }
        else if (notes[i].keys[0][0] === notes[i + 1].keys[0][0] && notes[0].keys[0][0] === notes[notes.length - 1].keys[0][0]) {
            notes[notes.length - 1] = notes[notes.length - 1].addAccidental(0, new VF.Accidental("n"));
            break;
        }

    }

    return notes;
}





//////////////////////////////////////////////////////////
//VEXFLOW NOTATION
VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".

//const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
const maj = document.getElementById("maj");
const min = document.getElementById("min");
const majPentatonic = document.getElementById("majpent");
const minPentatonic = document.getElementById("minpent");
const blues = document.getElementById("blues");
const dimish = document.getElementById("dimish");
const altered = document.getElementById("altered");
const jewish = document.getElementById("jewish");
const renderer = [
    new VF.Renderer(maj, VF.Renderer.Backends.SVG),
    new VF.Renderer(min, VF.Renderer.Backends.SVG),
    new VF.Renderer(majPentatonic, VF.Renderer.Backends.SVG),
    new VF.Renderer(minPentatonic, VF.Renderer.Backends.SVG),
    new VF.Renderer(blues, VF.Renderer.Backends.SVG),
    new VF.Renderer(dimish, VF.Renderer.Backends.SVG),
    new VF.Renderer(altered, VF.Renderer.Backends.SVG),
    new VF.Renderer(jewish, VF.Renderer.Backends.SVG)
]
let notesScale = [];


for (let i = 0; i < renderer.length; i++) {
    // Size our SVG:
    renderer[i].resize(500, 200);

    // And get a drawing context:
    let context = [];
    context[i] = renderer[i].getContext();
    // Create a stave at position 10, 40 of width 400 on the canvas.
    let stave = [];
    stave[i] = new VF.Stave(10, 40, 400);

    // Add a clef and time signature.
    stave[i].addClef("treble");

    // Connect it to the rendering context and draw!
    stave[i].setContext(context[i]).draw();

    notesScale[i] = notesNotation(stringNotes[i]);
    VF.Formatter.FormatAndDraw(context[i], stave[i], notesScale[i]);
}

/// DOM MANIPULATIONS

function manipulateHeaders() {

    const divText = [
        document.querySelector(".major-text"),
        document.querySelector(".minor-text"),
        document.querySelector(".majpent-text"),
        document.querySelector(".minpent-text"),
        document.querySelector(".blues-text"),
        document.querySelector(".dimish-text"),
        document.querySelector(".altered-text"),
        document.querySelector(".jewish-text")
    ]
    const headers = [
        " MAJOR",
        " MINOR",
        "MAJOR PENTATONIC",
        "MINOR PENTATONIC",
        "BLUES",
        "DIMISHED",
        "ALTERED",
        "JEWISH",
    ]

    for (let i = 0; i < divText.length; i++) {
        let h2 = document.createElement('h2');
        h2.innerText = `G ${headers[i]} SCALE`;
        divText[i].append(h2);
    }
}
//CALLING FUNCTION
manipulateHeaders();