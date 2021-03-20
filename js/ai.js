$(function() {
    console.log("Heyo");
    $("#mistakes").text(69);
});

function testFunc() {console.log("lmao");}
testFunc();

class Ai {
    constructor(model) {
        this.model = model;
        console.log("Loaded with a model");
    }
    
    // The minimum space a set of hints can fit into.
    minSpace(hints) {
        let num = hints.reduce((a, b) => a + b, 0) + hints.length - 1;
        return num;
    }
    
    // Executed whenever the AI Step button is pressed
    step() {
        //console.log("One small step for ai, one giant leap for AIKIND");
        let hits = [];

        // Check wiggle room for each column
        for (let i=0; i < this.model.get("dimensionWidth"); i++) {
            let w = this.model.get("dimensionHeight") - this.minSpace(this.model.get('hintsY')[i]);
            console.log(w);

            let len = this.model.get('hintsY')[i].length;

            //If any hints are larger than the wiggle room, do something about it
            for (let j=0; j < len; j++) {
                if (this.model.get('hintsY')[i][j] > w) {
                    let start = 0;
                    if (j > 0) {
                        start = this.minSpace(this.model.get('hintsY')[i].slice(0,j)) + 1;
                    }
                    let end = start + this.model.get('hintsY')[i][j];

                    for (let k = w + start; k < end; k++) {
                        hits.push([k,i]);
                    }
                }
            }
        }

        // Check wiggle room for each row
        for (let i=0; i < this.model.get("dimensionHeight"); i++) {
            let w = this.model.get("dimensionWidth") - this.minSpace(this.model.get('hintsX')[i]);
            console.log(w);

            let len = this.model.get('hintsX')[i].length;

            //If any hints are larger than the wiggle room, do something about it
            for (let j=0; j < len; j++) {
                if (this.model.get('hintsX')[i][j] > w) {
                    let start = 0;
                    if (j > 0) {
                        start = this.minSpace(this.model.get('hintsX')[i].slice(0,j)) + 1;
                    }
                    let end = start + this.model.get('hintsX')[i][j];

                    for (let k = w + start; k < end; k++) {
                        if (hits.indexOf([i,k]) == -1) {
                            hits.push([i,k]);
                        }
                    }
                }
            }
        }

        console.log(hits);
        hits.forEach((item, index) => {
            this.model.guess(item[0], item[1], 2);
        });



    }

    getRow(i) {
        return this.model.get('state')[i];
    }
    getCol(j) {
        return this.model.get('state').map(row => row[j]);
    }

    getCell(i, j) {
        return this.model.get('state')[i][j];
    }
}

/*
STATES
-2 : Hit, but a mistake [blue with x]
-1 : Block, but a mistake [grey with x]
0  : Unchecked
1  : Block
2  : Hit
*/
