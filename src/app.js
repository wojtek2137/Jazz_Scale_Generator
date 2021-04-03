
// const recipies = require('./index');
const scaleRecipies = {

    majScale: [2, 2, 1, 2, 2, 2, 1],
    minScale: [2, 1, 2, 2, 1, 2, 2],
    majPent: [2, 2, 3, 2],
    minPent: [3, 2, 2, 3],
    bluesScale: [3, 2, 1, 1, 3],
    dimishedScale: [1, 2, 1, 2, 1, 2, 1],
    alteredScale: [1, 2, 1, 2, 2, 2],
    jewishScale: [1, 3, 1, 2, 1, 2]

}

let keySigns = {
    sharp: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    flat: ["C", "Db", "D", "Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"]
}


class allScales {
    constructor(keySigns, scaleDegree, scaleRecipe) {
        this.keySigns = keySigns;
        this.scaleDegree = scaleDegree;
        this.scaleRecipe = scaleRecipe;

    }

    scaleGenerator() {
        let { scaleDegree } = this;
        let { keySigns, scaleRecipe } = this;

        let scaleResult = [];

        // enharmonic exceptions for sharp
        if (keySigns[keySigns.length - 1] !== "Cb") {
            if (scaleDegree === 5) { keySigns[4] = "E"; };
            if (scaleDegree === 6) { keySigns[5] = "E#"; };
            if (scaleDegree === 1) {
                keySigns[5] = "E#"; keySigns[0] = "B#";
            };

        }
        else if (keySigns[keySigns.length - 1] === "Cb") {
            if (scaleDegree === 2 || scaleDegree === 5) { keySigns[4] = "E"; };
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
        let actual = this.scaleGenerator();
        let octave = 4;
        let indexC = actual.indexOf("C");
        let indexCsharp = actual.indexOf("C#");
        let indexCflat = actual.indexOf("Cb");
        let indexDflat = actual.indexOf("Db");
        let indexD = actual.indexOf("D");

        for (let i = 0; i < actual.length; i++) {

            if (octave === 4) {
                if (i === indexC || i === indexCsharp || i === indexCflat || i === indexDflat || (i === indexD && this.scaleRecipe.indexOf("3") === -1 && actual[0] !== actual[indexD])) {

                    octave++;
                }

            }
            else if (actual[i][0] === "C") {

                octave++;

                for (let i = 1; i < actual.length; i++) {
                    if (actual[i - 1][0] === actual[i][0] && indexDflat !== 0) {
                        octave--;

                        break;
                    }
                }



            }


            actual[i] = `${actual[i]}/${octave}`;

        }
        return actual;
    }
    // My own function to generate accidentals for notes
    notesNotation() {
        let actual = this.octaveGenerator();
        let notes = [];

        for (let i = 0; i < actual.length; i++) {
            if (actual[i].indexOf("#") !== -1 || actual[i].indexOf("b") !== -1) {
                notes.push(new VF.StaveNote({ clef: "treble", keys: [actual[i]], duration: "w" }).addAccidental(0, new VF.Accidental(actual[i][1]))); //index1 is always an accidantal in this case
            }
            else if (actual[i].indexOf("#") === -1 || actual[i].indexOf("b") === -1) {
                notes.push(new VF.StaveNote({ clef: "treble", keys: [actual[i]], duration: "w" }));

            }
        }

        for (let i = 0; i < notes.length - 1; i++) {
            //Checks if there is appearence of "natural - accidental" 
            if (notes[i].keys[0][0] === notes[i + 1].keys[0][0] && this.keySigns.lastIndexOf("B") === -1) {

                notes[i + 1] = notes[i + 1].addAccidental(0, new VF.Accidental("n"));
            }
            else if (notes[i].keys[0][0] === notes[i + 1].keys[0][0] && notes[0].keys[0][0] === notes[notes.length - 1].keys[0][0]) {
                notes[notes.length - 1] = notes[notes.length - 1].addAccidental(0, new VF.Accidental("n"));
                break;
            }

        }

        return notes;
    }
}


function printAll() {
    const btnKeys = document.querySelectorAll('button[name=tonation]');
    const btnScls = document.querySelectorAll('button[name=kind]');
    const allButtons = document.querySelectorAll('button[type=button]');
    const divText = document.querySelector('#scale-text');
    const h2 = document.createElement('h2');
    let scaleDegreeSharp = 0;
    let scaleDegreeFlat = 0;
    let handle = null;
    //TONATION BUTTON
    for (let btn of btnKeys) {
        btn.addEventListener('click', function () {
            btn.classList.toggle('active');
            scaleDegreeSharp = keySigns.sharp.indexOf(btn.innerText);
            scaleDegreeFlat = keySigns.flat.indexOf(btn.innerText);
            handle = btn;
        })
        if (handle === btn) {
            break;
        }
    }
    //SCALE BUTTON
    for (let btnScl of btnScls) {
        btnScl.addEventListener('click', function () {
            btnScl.classList.toggle('active');
            let selectedScale = btnScl.id;
            let Scale = new allScales(keySigns.sharp, scaleDegreeSharp, scaleRecipies[selectedScale]);
            if (handle.classList.contains("button-flat")) {
                Scale = new allScales(keySigns.flat, scaleDegreeFlat, scaleRecipies[selectedScale]);
            }

            else if ((handle.innerText === "C" || handle.innerText === "G" || handle.innerText === "D") && (selectedScale !== "majPent" && selectedScale !== "majScale")) {
                Scale = new allScales(keySigns.flat, scaleDegreeFlat, scaleRecipies[selectedScale]);
            }
            //calling vexFlow to generate music notation
            vexFlowNotation(Scale);
            //delete first greeting
            const h1 = document.querySelector("h1");
            h1.remove();
            //print key and name of printed 
            h2.innerText = `${handle.innerText} ${btnScl.innerText}`;
            divText.appendChild(h2);
            //Disable all buttons after one attempt
            for (let btnAll of allButtons) {
                btnAll.disabled = true;
            }
            handle.classList.toggle('active');
            btnScl.classList.toggle('active');

        })

    }
    //RESET BUTTON
    let handleString = "Let's click to select another scale";
    const h1 = document.createElement("h1")
    const windowTextDiv = document.querySelector("#all");
    const resetBtn = document.querySelector('#newScaleBtn');
    if (h1.innerText !== handleString) {
        resetBtn.addEventListener('click', function (e) {
            for (let btnAll of allButtons) {
                btnAll.disabled = false;
            }
            h2.remove();
            let imgs = document.querySelectorAll("svg");
            for (img of imgs) {
                img.remove();
            }
            h1.innerText = handleString;
            windowTextDiv.append(h1);
            //reload
            //window.location.reload(true);
        })
    }
}

const vexFlowNotation = (Scale) => {
    VF = Vex.Flow;
    // Create an SVG renderer and attach it to the DIV element named "boo".
    var all = document.getElementById("all")
    var renderer = new VF.Renderer(all, VF.Renderer.Backends.SVG);
    // Size our SVG:
    renderer.resize(500, 200);
    // And get a drawing context:
    var context = renderer.getContext();
    // Create a stave at position 10, 40 of width 400 on the canvas.
    var stave = new VF.Stave(65, 40, 400);
    // Add a clef and time signature.
    stave.addClef("treble");
    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
    let notes = Scale.notesNotation();
    VF.Formatter.FormatAndDraw(context, stave, notes);
}

printAll();


//////////////////////////////////////////////////////////
//VEXFLOW NOTATION


// TESTS
// C - Dur 
// 1. Maj -Sharp
//2. min - flat 
//3. minPent - flat
// 4. majPent - sharp
// 5. bluesScale, dimished,altered - flat
// D,A,E,B,F#(dimished,altered problem) all scales Test done
// G - dur 
// 1. majScale sharp
// 2 minScale, bluesScale, minPent flat
//3. 





