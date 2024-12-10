
let numberOfDices = 6;
let selectionOfDice = {};
let roundScore = 0;
let totalScorePlayer1 = 0;
let totalScorePlayer2 = 0;
const scoringRules = {
    single: { 1: 100, 5: 50 }, // Single 1 and 5 have specific scores
    doubles: {1:200, 5:100},
    triple: { 1: 1000, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 }, // Triples for any number
    straight: 1500, // Example of a straight (1-2-3-4-5-6)
    threePairs: 1500, // Example of three pairs
    fourOfAKind: 1000, // Adjust as needed
    fiveOfAKind: 2000,
    sixOfAKind: 3000,
};
document.getElementById("rollDice").addEventListener("click", rollDice);
function rollDice() {
    // console.log("Clicked");
    resetTiles(0);
    let diceTiles = shuflleTiles(numberOfDices);//these are the tiles randomly chosen to have a die
    // console.log(diceTile);
    for (let i = 0; i < numberOfDices; i++) {
        let tileNo = diceTiles[i]//
        // console.log("dice tile "+tile);
        const tile = document.getElementById(`tile${tileNo}`);//gets the i th tile from randomly chosen 6 tiles
        const roll = Math.floor(Math.random() * 6) + 1;
        tile.dataset.value = roll;
        // console.log(dice.dataset.value);
        // console.log("dice face "+roll);
        tile.style.backgroundImage = `url('Dice/dice ${roll}.webp')`;
        tile.style.transform = `rotate(${Math.random() * 360}deg)`;
    }
}

//shuffled dice tile return an array of shuffled array of int corresponding dies tile

function shuflleTiles(numberOfDices){
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16];
    let r = 0;
    let temp = 0;
    for (let i = 15; i > 0; i--) {
        r = Math.floor(Math.random() * (i + 1));
        temp = nums[i];
        nums[i] = nums[r];
        nums[r] = temp;
    }
    return nums.slice(0,numberOfDices);
}
// this function deletes the images of dice from tiles
// otherwise the images will stay in the tiles forever
// o === all tiles , otherwise specified tile
function resetTiles(tileNumber){
    if(tileNumber === 0){//reset all tiles
        const alltiles = document.getElementsByClassName("tile");
        for (let i = 0; i < 16; i++) { //reset all tiles
            alltiles[i].style.backgroundImage = null;
            alltiles[i].setAttribute("data-value","");
            alltiles[i].classList.remove("tileHighlighted");
        }
        selectionOfDice = {};
    }
    else{//reset the specific tile
        const tile = document.getElementById('tile{tileNumber}');
        tile.style.backgroundImage = null;
        tile.setAttribute("data-value","");
    }

}


document.querySelectorAll('.tile').forEach(tile => {//Node value
    tile.addEventListener('click', () => {
        const dieSelectedValue = tile.dataset.value; // The value of the dice
        const dieSelectedId = tile.id; // The ID of the dice (e.g., "dice1")
        if(dieSelectedValue){
            if (!(dieSelectedId in selectionOfDice)) {
                // Add the dice to the selection
                selectionOfDice[dieSelectedId] = dieSelectedValue;
                tile.classList.add("tileHighlighted");
            } else {
                // Remove the dice from the selection
                delete selectionOfDice[dieSelectedId];
                tile.classList.remove("tileHighlighted");
            }
        }


        console.log(selectionOfDice); // Debugging
        console.log(findMelds(diceSelection())); // Debugging
    });
});

// Step 2: Analyze the Player's Selection
// dice Selection returns the frequency of each dice in player's selection
function diceSelection(){
    // step 1 : formatting
    const values = Object.values(selectionOfDice).map(Number); //return an array of number. These are values of dice
    // occurrence of value store a dictionary with the frequency of dice value used to calculate score
    const occurrenceOfValue = {};
    values.forEach(value => {
        occurrenceOfValue[value] = (occurrenceOfValue[value] || 0) + 1;//check if already there is an occurrence
        // this step is necessary because it prevents error like undefined + 1 = NaN
    });
    return occurrenceOfValue;// return an object of dice frequency like {1:3,5:2} etc.
}

//Step 3: Determine Valid Melds
function findMelds(occurrenceOfValue){
    const melds = [];
    let pairCount = 0;
    let isSixer = false;

    //check for Run (1,2,3,4,5,6)
    const isRun = [1,2,3,4,5,6].every((num)=>occurrenceOfValue[num]>0 );//return false on encountering least one false value



    // check for triple pairs and straight six in a single pass
    Object.keys(occurrenceOfValue).forEach((valueStr) => {
        const count = occurrenceOfValue[valueStr];
        if(count === 2){
            pairCount++;
        }
        if(count === 6){
            isSixer = true;
        }
    });
    if(isRun){
        melds.push({ type: 'Run', score: 3000 });
    }
    else if(pairCount === 3){
        melds.push({ type: 'Triple Pairs', score: 2000 });
    }
    else if(isSixer){
        melds.push({ type: 'Six Of A Kind', score: 2500 });
    }
    else{
        Object.keys(occurrenceOfValue).forEach((valueStr) => {
            const count = occurrenceOfValue[valueStr];
            if(count === 5){
                melds.push({ type: 'Five of a kind', score: 2000 });
                occurrenceOfValue[valueStr] -=5;
            }
            if(count === 4){
                melds.push({ type: 'Four of a kind', score: 1500 });
                occurrenceOfValue[valueStr] -=4;
            }
            if (count === 3){
                melds.push({ type: `Triple ${valueStr}`, score: scoringRules.triple[valueStr] });
                occurrenceOfValue[valueStr] -=3;
            }
            if (count === 2 && scoringRules.doubles[valueStr]) {
                melds.push({ type: `Double ${valueStr}`, score: scoringRules.doubles[valueStr] });
                occurrenceOfValue[valueStr] -=2;
            }
            if (count === 1 && scoringRules.single[valueStr]){
                melds.push({ type: `Single ${valueStr}`, score: scoringRules.single[valueStr] });
                occurrenceOfValue[valueStr] -=1;
            }
        });
    }
    return melds
}