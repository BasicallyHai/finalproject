//all scripts that do not affect the rules of the dice game

const beginBtn        = document.getElementById("begin-btn");
const gameContainer   = document.getElementById("game-container");
const welcomeScreen   = document.getElementById("welcome");
const gameScreen      = document.getElementById("active-game-container");
const playBtn         = document.getElementById("play-btn");
const roundTracker    = document.getElementById("round-tracker");
const playerStats     = document.getElementById("player-stats");
const opponentStats   = document.getElementById("opponent-stats");
const gameSummary     = document.getElementById("game-summary");
const playerImage     = document.getElementById("player-image-container");
const opponentImage   = document.getElementById("opponent-image-container");
const backgroundMusic = document.getElementById("background-music");
const muteBtn         = document.getElementById("mute");

const player1     = new Player(); // player
const player2     = new Player(); // opponent
const FIRST_ROUND = 1;
const LAST_ROUND  = 3;

let currentRound = FIRST_ROUND;
let summaryHTML  = "";

diceGame = new DiceGame();

beginBtn.addEventListener("click", begin);

function begin(){
    welcomeScreen.classList.add("fade-out-image");
    gameScreen.classList.add("fade-in-image"); 
    gameScreen.style.display = "grid";
    
    backgroundMusic.play();
    backgroundMusic.volume = 0.5;
    backgroundMusic.loop = true;
    muteBtn.addEventListener("click", toggleMuteBackgroundMusic);
    
    playBtn.addEventListener("click", playRoundOfDiceGame);
}

function playRoundOfDiceGame()
{
    summaryHTML = "";
    
    let allDiceRolls = diceGame.playRound(player1, player2);

    let playerDiceRolls     = allDiceRolls[0];
    let playerDiceRollOne   = playerDiceRolls[0];
    let playerDiceRollTwo   = playerDiceRolls[1];
    
    let opponentDiceRolls   = allDiceRolls[1];
    let opponentDiceRollOne = opponentDiceRolls[0];
    let opponentDiceRollTwo = opponentDiceRolls[1];    
    
    playerImage.innerHTML   = `<img src='../images/dice.jpg' alt="two dice">`;
    opponentImage.innerHTML = `<img src='../images/dice.jpg' alt="two dice">`;

    playerImage.firstChild.classList.add("shake-image");
    opponentImage.firstChild.classList.add("shake-image");
    
    const MILLISECONDS_PER_SECOND = 1000;

    let animationDurationStyleValue = window.getComputedStyle(playerImage.firstChild).getPropertyValue('animation-duration');
    let animationDelayMs            = parseFloat(animationDurationStyleValue) * MILLISECONDS_PER_SECOND;
    let delayMs                     = animationDelayMs;

    startRound(function(){
        playerImage.firstChild.classList.remove("shake-image");
        computerImage.firstChild.classList.remove("shake-image");

        setDiceImages(playerDiceRollOne, playerDiceRollTwo, opponentDiceRollOne, opponentDiceRollTwo);
        
        let playerRoundScore   = diceGame.determineRoundScore(playerDiceRolls);
        let opponentRoundScore = diceGame.determineRoundScore(opponentDiceRolls);

        let player1TotalScore;
        let player2TotalScore;

        player1TotalScore = player1.getScore();
        player2TotalScore = player2.getScore();

        if(currentRound < LAST_ROUND)
        {
            summaryHTML += `<p>You rolled a ${playerDiceRollOne} and a ${playerDiceRollTwo} for a total of ${playerRoundScore} points.</p>`;
            summaryHTML += `<p>The opponent rolled a ${opponentDiceRollOne} and a ${opponentDiceRollTwo} for a total of ${opponentRoundScore} points.</p>`;
            currentRound++;
        }
        else
        {
            generateWinnerSummary(player1TotalScore, player2TotalScore);

            playBtn.innerHTML = "Play Again?";
            playBtn.removeEventListener("click", playRoundOfDiceGame);
            playBtn.addEventListener("click", playAgain);
        }
        
        updateDisplay(playerRoundScore, opponentRoundScore);
    }, delayMs);
}

function updateDisplay(playerRoundScore, opponentRoundScore)
{
    roundTracker.innerHTML  = `<p>Round:${currentRound}</p>`;
    
    if(currentRound == FIRST_ROUND)
    {
        playerStats.innerHTML   =  ``
        opponentStats.innerHTML =  ``
    }
    else
    {
        playerStats.innerHTML   =  `<p>Total Score: ${player1.getScore()}</p>`
        playerStats.innerHTML   += `<p>Round Score: ${playerRoundScore}</p>`;
        opponentStats.innerHTML =  `<p>Total Score: ${player2.getScore()}</p>`
        opponentStats.innerHTML += `<p>Round Score: ${opponentRoundScore}</p>`;
    }

    gameSummary.innerHTML   = summaryHTML;
}

function setDiceImages(playerDiceRollOne, playerDiceRollTwo, opponentDiceRollOne, opponentDiceRollTwo)
{
    playerImage.innerHTML  = `<img src='../images/dice${playerDiceRollOne}.png' alt="player first dice roll">`;
    playerImage.innerHTML += `<img src='../images/dice${playerDiceRollTwo}.png' alt="player second dice roll">`;

    opponentImage.innerHTML  = `<img src='../images/dice${opponentDiceRollOne}.png' alt="opponent first dice roll">`;
    opponentImage.innerHTML += `<img src='../images/dice${opponentDiceRollTwo}.png' alt="opponent second dice roll">`;
}


function playAgain() //reset scores
{
    player1.setScore(0);
    player2.setScore(0);
    
    summaryHTML             = "";
    currentRound            = FIRST_ROUND;
    playerImage.innerHTML   = `<img src='../images/dice.png' alt="two dice">`;
    opponentImage.innerHTML = `<img src='../images/dice.png' alt="two dice">`;
    updateDisplay();
    
    playBtn.removeEventListener("click", playAgain);
    playBtn.innerHTML = "Click to Roll";
    playBtn.addEventListener("click", playRoundOfDiceGame);
}

function generateWinnerSummary(player1TotalScore, player2TotalScore)
{
    // determine winner and create summary
    let winnerSummary = diceGame.determineWinner(player1TotalScore, player2TotalScore);

    summaryHTML += winnerSummary;
    summaryHTML += `<p>Your final score was: ${player1TotalScore}</p>`;
    summaryHTML += `<p>The opponent's final score was: ${player2TotalScore}</p>`;

    // play appropriate sound
    if(winnerSummary.includes("You win"))
    {
        playWinSound();
    }
    else if(winnerSummary.includes("The opponent won"))
    {
        playLoseSound();
    }
    else
    {
        playTieSound();
    }
}


function toggleMuteBackgroundMusic() //mutes/unmutes bg music
{
    
    if(backgroundMusic.muted == false)
    {
        backgroundMusic.muted = true;
        muteBtn.setAttribute("src", "../images/mute_icon.svg");
    }
    else
    {
        backgroundMusic.muted = false;
        muteBtn.setAttribute("src", "../images/unmuted_icon.svg")
    }
}

function playWinSound() //plays win sound when you win
{
    let winSound = new Audio("../audio/win.mp3");
    winSound.play();
}


function playLoseSound() //plays lose sound when you lose
{
    let loseSound = new Audio("../audio/lose.mp3");
    loseSound.play();
}

function playTieSound() //plays lose soudn when you tie
{
    let tieSound = new Audio("../audio/tie.mp3");
    tieSound.play();
}