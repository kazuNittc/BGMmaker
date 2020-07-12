// シンセインスタンス
var chordSynth, kick, snare, hihat;

// 現在の再生状態を格納 0:stop / 1:play
var plySw = 0;

// コードパターンを格納
var chordBase = [], chordMiddle = [], chordTop = [];
var bassNt;

// 現在のコードパターンにいいねしたかどうか
var likeSw = 0;

// 現在のコードパターン
var direction;
var chdDrct;

// いいねしたコードパターンを格納
var likeChordBase, likeChordMiddle, likeChordTop;
var likeBassNt;
var likeChdDrct;
var likeDirection;

var likeBtnElm = document.querySelector("#like");
likeBtnElm.disabled = true;

// C natural minor scale
var chordTonic = [
    [ // Cm
        {note : "C4", dur : "1n"},
        {note : "D#4", dur : "1n"},
        {note : "G4", dur : "1n"}
    ],
    [ // Eb
        {note : "D#4", dur : "1n"},
        {note : "G4", dur : "1n"},
        {note : "A#4", dur : "1n"}
    ],
    [ // Ab
        {note : "C4", dur : "1n"},
        {note : "D#4", dur : "1n"},
        {note : "G#4", dur : "1n"}
    ]
];
var chordDominant = [
    /*
    [ // Eb
        {note : "D#4", dur : "1n"},
        {note : "G4", dur : "1n"},
        {note : "A#4", dur : "1n"}
    ],
    */
    [ // Gm
        {note : "D4", dur : "1n"},
        {note : "G4", dur : "1n"},
        {note : "A#4", dur : "1n"}
    ],
    [ // Bb
        {note : "D4", dur : "1n"},
        {note : "F4", dur : "1n"},
        {note : "A#4", dur : "1n"}
    ]
];
var chordSubdominant = [
    [ // Fm
        {note : "C4", dur : "1n"},
        {note : "F4", dur : "1n"},
        {note : "G#4", dur : "1n"}
    ],
    [ // Dm-5
        {note : "D4", dur : "1n"},
        {note : "F4", dur : "1n"},
        {note : "G#4", dur : "1n"}
    ]
];

var bassTonic = [
    [ // Cm
        {note : "C2", dur : "1n"}
    ],
    [ // Eb
        {note : "D#2", dur : "1n"}
    ],
    [ // Ab
        {note : "G#2", dur : "1n"}
    ]
];
var bassDominant = [
    /*
    [ // Eb
        {note : "D#3", dur : "1n"}
    ],
    */
   [ // Gm
        {note : "G2", dur : "1n"}
   ],
   [ // Bb
        {note : "A#2", dur : "1n"}
   ]
];
var bassSubdominant = [
    [ // Fm
        {note : "F2", dur : "1n"}
    ],
    [ // Dm-5
        {note : "C#2", dur : "1n"}
    ]
]

window.onload = function() {
    chordSynth = new Tone.PolySynth(3, Tone.FMSynth, {
        "oscillator" : {
            "type" : "sine"
        },
        "envelope" : {
            "attack" : 0.05,
            "decay" : 5.0,
            "sustain" : 0.1,
            "release" : 2.0
        },
        "modulationOscillator" : {
            "type" : "triangle"
        },
        "modulationEnvelope" : {
            "attack" : 0.25,
            "decay" : 0.9,
            "sustain" : 0.2,
            "release" : 0.01
        },
        "poertamento" : 0.05,
        "harmonicity" : 1.0,
        "modulationIndex" : 3
    }).toMaster();

    bass = new Tone.Synth({
        "volume" : -15,
        "oscillator" : {
            "type" : "sine"
        },
        "envelope" : {
            "attack" : 0.05,
            "decay" : 0.2,
            "sustain" : 1.0,
            "release" : 1.5,
        },
        "portamento" : 0.05
    }).toMaster();

    kick = new Tone.MembraneSynth({
        "pitchDecay" : 0.008,
		"octaves" : 2,
		"envelope" : {
			"attack" : 0.0006,
			"decay" : 0.5,
			"sustain" : 0
		}
    }).toMaster();

    snare = new Tone.NoiseSynth({
        "volume" : -10,
        "envelope" : {
            "attack" : 0.001,
            "decay" : 0.4,
            "sustain" : 0
        }
    }).toMaster();

    hihat = new Tone.NoiseSynth({
        "volume" : -20,
        "envelope" : {
            "attack" : 0.001,
            "decay" : 0.05,
            "sustain" : 0
        }
    }).toMaster();
    
    likeChordBase = []; console.log(likeChordBase);
    likeChordMiddle = [];
    likeChordTop = [];
    likeBassNt = [];
    likeChdDrct = "";
    likeDirection = "";

    createPattern();
    setSequence();
    Tone.Transport.bpm.value = 60;
};

function createPattern() {
    var chordStat = Math.floor(Math.random() * 3);
    var chdSel;
    direction = likeDirection;
    chdDrct = likeChdDrct;
    chordBase = likeChordBase;
    chordMiddle = likeChordMiddle;
    chordTop = likeChordTop;
    bassNt = likeBassNt;
    for (let i=0; i<8; i++) {
        if (chordStat == 0) { // tonic
            if (Math.floor(Math.random() * 2) == 0) { // to dominant
                direction += "D";
                chdDrct += "D:";
                chdSel = Math.floor(Math.random() * 2);
                chordBase.push(chordDominant[chdSel][0]);
                chordMiddle.push(chordDominant[chdSel][1]);
                chordTop.push(chordDominant[chdSel][2]);
                bassNt.push(bassDominant[chdSel]);
                chordStat = 1;
                chdDrct += (chdSel == 0 ? "Gm " : "Bb ");
            } else { // to subdominant
                direction += "S";
                chdDrct += "S:";
                chdSel = Math.floor(Math.random() * 2);
                chordBase.push(chordSubdominant[chdSel][0]);
                chordMiddle.push(chordSubdominant[chdSel][1]);
                chordTop.push(chordSubdominant[chdSel][2]);
                bassNt.push(bassSubdominant[chdSel]);
                chordStat = 2;
                chdDrct += (chdSel == 0 ? "Fm " : "Dm-5 ");
            }
        } else if (chordStat == 1) { // dominant (to tonic)
            direction += "T";
            chdDrct += "T:";
            chdSel = Math.floor(Math.random() * 3);
            chordBase.push(chordTonic[chdSel][0]);
            chordMiddle.push(chordTonic[chdSel][1]);
            chordTop.push(chordTonic[chdSel][2]);
            bassNt.push(bassTonic[chdSel]);
            chordStat = 0;
            chdDrct += (chdSel == 0 ? "Cm " : (chdSel == 1 ? "Eb " : "Ab "));
        } else { // subdominant
            if (Math.floor(Math.random() * 2) == 0) { // to tonic
                direction += "T";
                chdDrct += "T:";
                chdSel = Math.floor(Math.random() * 3);
                chordBase.push(chordTonic[chdSel][0]);
                chordMiddle.push(chordTonic[chdSel][1]);
                chordTop.push(chordTonic[chdSel][2]);
                bassNt.push(bassTonic[chdSel]);
                chordStat = 0;
                chdDrct += (chdSel == 0 ? "Cm " : (chdSel == 1 ? "Eb " : "Ab "));
            } else { // to dominant
                direction += "D";
                chdDrct += "D:";
                chdSel = Math.floor(Math.random() * 2);
                chordBase.push(chordDominant[chdSel][0]);
                chordMiddle.push(chordDominant[chdSel][1]);
                chordTop.push(chordDominant[chdSel][2]);
                bassNt.push(bassDominant[chdSel]);
                chordStat = 1;
                chdDrct += (chdSel == 0 ? "Gm " : "Bb ");
            }
        }
    }

    console.log(chdDrct);
    if ((direction.slice(0, 1) == direction.slice(-1)) | (direction.slice(-1) == "D" & direction.slice(0, 1) == "S")) {
        console.log("-> Regenerate");
        createPattern();
    }

    document.getElementById("msgdoc").innerText = "生成完了";
}

function setSequence() {
    var chordBasePart = new Tone.Sequence(function(time, {note, dur}) {
        chordSynth.triggerAttackRelease(note, dur, time);
    }, chordBase, "1n").start(0);
    var chordMiddlePart = new Tone.Sequence(function(time, {note, dur}) {
        chordSynth.triggerAttackRelease(note, dur, time);
    }, chordMiddle, "1n").start(0);
    var chordTopPart = new Tone.Sequence(function(time, {note, dur}) {
        chordSynth.triggerAttackRelease(note, dur, time);
    }, chordTop, "1n").start(0);
    var bassPart = new Tone.Sequence(function(time, {note, dur}) {
        bass.triggerAttackRelease(note, dur, time);
    }, bassNt, "1n").start(0);
    var kickPart = new Tone.Sequence(function(time, pitch) {
        kick.triggerAttack(pitch, time, 1);
    }, ["C3", "C3"], "2n").start(0);
    var snarePart = new Tone.Loop(function(time) {
        snare.triggerAttack(time);
    }, "2n").start("4n");
    var hihatPart = new Tone.Loop(function(time) {
        hihat.triggerAttack(time);
    }, "16n").start(0);
}

plybtn.addEventListener("click", function() {
    if (plySw == 0) {
        Tone.Transport.start();
        plybtn.value = "stop";
        //likeBtnElm.disabled = false;
        plySw = 1;
        document.getElementById("msgdoc").innerText = "再生中";
    } else {
        Tone.Transport.stop();
        plybtn.value = "play";
        //likeBtnElm.disabled = true;
        plySw = 0;
        document.getElementById("msgdoc").innerText = "再生停止";
    }
});

newlp.addEventListener("click", function() {
    //Tone.Transport.stop();
    createPattern();
    setSequence();
    Tone.Transport.start();
    plybtn.value = "stop";
    //likeBtnElm.disabled = false;
    plySw = 1;
    likeSw = 0;
    document.getElementById("msgdoc").innerText = "再生中";
});

like.addEventListener("click", function() {
    console.log(bassNt);
    if (likeSw == 0) {
        chordBase.forEach(function(c) {
            likeChordBase.push(c);
        });
        chordMiddle.forEach(function(c) {
            likeChordMiddle.push(c);
        });
        chordTop.forEach(function(c) {
            likeChordTop.push(c);
        });
        bassNt.forEach(function(c) {
            likeBassNt.push(c);
        });
        likeSw = 1;
    }
    console.log(likeBassNt);
});