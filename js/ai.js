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
        let guesses = this.wallSqueeze([]);


        console.log(guesses);
        guesses.forEach((item, index) => {
            this.model.guess(item[0], item[1], item[2]);
        });


        guesses = this.wallPush([]);


        console.log(guesses);
        guesses.forEach((item, index) => {
            this.model.guess(item[0], item[1], item[2]);
        });



    }

    wallSqueeze(guesses) {
        // Check wiggle room for each column
        for (let i=0; i < this.model.get("dimensionWidth"); i++) {
            let w = this.model.get("dimensionHeight") - this.minSpace(this.model.get('hintsY')[i]);
            //console.log(w);

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
                        if (guesses.indexOf([k,i,2]) == -1) {
                            guesses.push([k,i,2]);
                        }
                    }
                }
            }
        }

        // Check wiggle room for each row
        for (let i=0; i < this.model.get("dimensionHeight"); i++) {
            let w = this.model.get("dimensionWidth") - this.minSpace(this.model.get('hintsX')[i]);
            //console.log(w);

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
                        if (guesses.indexOf([i,k,2]) == -1) {
                            guesses.push([i,k,2]);
                        }
                    }
                }
            }
        }
        return guesses;
    }

    wallPush(guesses) {

        // Check any obvious wall pushes for each column
        for (let col=0; col < this.model.get("dimensionWidth"); col++) {

            let len = this.model.get('hintsY')[col].length;

            //From the front
            let placeFlag = false;
            let blockCap = false;
            let hint = this.model.get('hintsY')[col][0];

            for (let j=0; j < hint; j++) {
                if (placeFlag) {
                    guesses.push([j,col,2]);
                }
                else if (this.getCell(j, col) == 2 || this.getCell(j, col) == -2) {
                    placeFlag = true;
                    if (j == 0) {
                        blockCap = true;
                    }
                }
            }

            if (blockCap) {
                guesses.push([hint,col,1]);
            }

            //From the back
            placeFlag = false;
            blockCap = false;
            hint = this.model.get('hintsY')[col][len-1];
            let max = this.model.get("dimensionWidth");

            for (let j=max-1; j > max-hint-1; j--) {
                if (placeFlag) {
                    guesses.push([j,col,2]);
                }
                else if (this.getCell(j, col) == 2 || this.getCell(j, col) == -2) {
                    placeFlag = true;
                    if (j == max-1) {
                        blockCap = true;
                    }
                }
            }

            if (blockCap) {
                guesses.push([max-hint-1,col,1]);
            }


        }

        // Check any obvious wall pushes for each row


        // Check any obvious wall pushes for each column
        for (let row=0; row < this.model.get("dimensionHeight"); row++) {

            let len = this.model.get('hintsX')[row].length;

            //From the front
            let placeFlag = false;
            let blockCap = false;
            let hint = this.model.get('hintsX')[row][0];

            for (let j=0; j < hint; j++) {
                if (placeFlag) {
                    guesses.push([row,j,2]);
                }
                else if (this.getCell(row, j) == 2 || this.getCell(row, j) == -2) {
                    placeFlag = true;
                    if (j == 0) {
                        blockCap = true;
                    }
                }
            }

            if (blockCap) {
                guesses.push([row,hint,1]);
            }

            //From the back
            placeFlag = false;
            blockCap = false;
            hint = this.model.get('hintsX')[row][len-1];
            let max = this.model.get("dimensionHeight");

            for (let j=max-1; j > max-hint-1; j--) {
                if (placeFlag) {
                    guesses.push([row,j,2]);
                }
                else if (this.getCell(row,j) == 2 || this.getCell(row,j) == -2) {
                    placeFlag = true;
                    if (j == max-1) {
                        blockCap = true;
                    }
                }
            }

            if (blockCap) {
                guesses.push([row,max-hint-1,1]);
            }


        }

        return guesses;
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
