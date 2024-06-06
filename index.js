var cardsArr = [];
var loadedCards = [];
var currentCard, nextCard;
var currentCardID, nextCardID;
var processing = false;
var numberOfClicks = 0;
var noOfMatched = 0;
var timeoutID = undefined;

// Load all image paths into an array
for (var i = 0; i < 54; i++) {
    var imagePath = `Images/Cards/avengers${i}.jpg`;
    cardsArr.push(imagePath);
}

//Distributing the cards in a random manner
function shuffleCards(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//This function in called onloading the page and when clicking start new game to rearrange cards, reset vars
function reloadImages() {
    if (timeoutID) clearTimeout(timeoutID);
    resetVariables();
    loadedCards = [];
    noOfMatched = 0;
    numberOfClicks = 0;
    document.getElementById("clicks").innerHTML = `Number Of Clicks &#187; ${numberOfClicks}`;
    for (var j = 0; j < 8; j++) {
        var getCard = cardsArr[Math.floor(Math.random() * 54)];
        loadedCards[j] = getCard;
        loadedCards[15 - j] = getCard;
    }
    shuffleCards(loadedCards);
    for (var i = 0; i < 16; i++) {
        var button = document.getElementById(i);
        button.querySelector('.back').src = loadedCards[i];
        button.style.visibility = 'visible';
        button.classList.remove('flipped');
        button.querySelector('.card').style.border = '';
    }
}

// Main function called on each button click that make all checks for the single card and same card and different cards
async function Flip(pressedButton) {
    if (processing) return; // This is used to check if 2 cards are flipped already then no more cards to flip
    document.getElementById("clicks").innerHTML = `Number Of Clicks &#187; ${++numberOfClicks}`;
    var button = document.getElementById(pressedButton.id);
    var cardID = parseInt(pressedButton.id);
    if (currentCardID === undefined) { //one card clicked
        currentCard = loadedCards[cardID];
        currentCardID = cardID;
        button.classList.add('flipped');
    } else { // 2 cards with more than one option
        nextCard = loadedCards[cardID];
        nextCardID = cardID;
        button.classList.add('flipped');
        processing = true;
        if (currentCard === nextCard && currentCardID !== nextCardID) {//2 cards matched with different ID's
            await delay(350);
            match();
            timeoutID = setTimeout(() => {
                excludeCard(currentCardID);
                excludeCard(nextCardID);
                noOfMatched++;
                checkEndGame();
                resetVariables();
            }, 5000);
        } 
        else if (currentCardID !== nextCardID) { //Non match
            await delay(350);
            nonMatch();
            timeoutID = setTimeout(() => {
                reFlip(currentCardID);
                reFlip(nextCardID);
                resetVariables();
            }, 5000);
        } 
        else processing = false;
    }
}

//Delay Function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Setting the back of the card again
function reFlip(id) {
    var button = document.getElementById(id);
    button.classList.remove('flipped');
    button.querySelector('.card').style.border = '';
}

//when matching it assign green border to the 2 cards using the card's id to the card place
function match() {
    document.getElementById(currentCardID).querySelector('.card').style.border = '4px solid green';
    document.getElementById(nextCardID).querySelector('.card').style.border = '4px solid green';
}

//when matching it assign red border to the 2 cards using the card's id to the card place
function nonMatch() {
    document.getElementById(currentCardID).querySelector('.card').style.border = '4px solid red';
    document.getElementById(nextCardID).querySelector('.card').style.border = '4px solid red';
}

//Excluding the cards form the board "NON visible"
function excludeCard(id) {
    var button = document.getElementById(id);
    button.style.visibility = 'hidden';
}

//If 2 pairs are completed ( 16 cards matched ) the message will appear depending on the clicks case(<40<)
function checkEndGame() {
    if (noOfMatched === 8) {
        var messageBox = document.getElementById("message-box");
        var blurBackground = document.getElementById("blur-background");
        if (numberOfClicks <= 40) {
            messageBox.textContent = "Success! You completed the game❤️";
        } else {
            messageBox.textContent = "Fail! Too many clicks🧐 Hard Luck👾";
        }
        blurBackground.style.display = "block";
        messageBox.style.display = "block";
        setTimeout(() => {
            blurBackground.style.display = "none";
            messageBox.style.display = "none";
        }, 3000);
    }
}

//Resets the stats of the variables
function resetVariables() {
    currentCard = undefined;
    nextCard = undefined;
    currentCardID = undefined;
    nextCardID = undefined;
    processing = false;
}