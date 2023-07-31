//all scripts containing the rules for the dice game
class Player
{
   NO_SCORE = 0;

   constructor()
   {
       this.totalScore = this.NO_SCORE;
   }

   addToScore(roundScore)
   {
       this.totalScore += roundScore;
   }

   getScore()
   {
       return this.totalScore;
   }
    
   setScore(score)
   {
       this.totalScore = score;
   }
}


class DiceGame
{
   playRound(player1, player2)
   {
       let player1DiceRolled = this.rollDice();
       let player1RoundScore = this.determineRoundScore(player1DiceRolled);
       player1.addToScore(player1RoundScore);
       
       let player2DiceRolled = this.rollDice();
       let player2RoundScore = this.determineRoundScore(player2DiceRolled);
       player2.addToScore(player2RoundScore);
       
       let allDiceRolls = [player1DiceRolled, player2DiceRolled];

       return allDiceRolls;
   }

   rollDice()
   {
       const MIN_DICE_ROLL = 1;
       const MAX_DICE_ROLL = 6;
       
       let rollOne = Math.floor(Math.random() * (MAX_DICE_ROLL - MIN_DICE_ROLL + 1) + MIN_DICE_ROLL);
       let rollTwo = Math.floor(Math.random() * (MAX_DICE_ROLL - MIN_DICE_ROLL + 1) + MIN_DICE_ROLL);

       let diceRolled = [rollOne, rollTwo];

       return diceRolled;
   }

   determineRoundScore(diceRolled)
   {
       const NO_SCORE_DICE_FACE   = 1;
       const NO_SCORE             = 0;
       const ROLL_ONE             = diceRolled[0];
       const ROLL_TWO             = diceRolled[1];
       const SAME_ROLL_MULTIPLIER = 2;
       
       if(diceRolled.includes(NO_SCORE_DICE_FACE))
       {
           return NO_SCORE;
       }
       else if(ROLL_ONE == ROLL_TWO)
       {
           let roundScore = SAME_ROLL_MULTIPLIER * (ROLL_ONE + ROLL_TWO);
           return roundScore;
       }
       else
       {
           return ROLL_ONE + ROLL_TWO;
       }
   }

   determineWinner(player1FinalScore, player2FinalScore)
   {
       if(player1FinalScore > player2FinalScore)
       {
           return "<p>You win!</p>";
       }
       else if(player1FinalScore == player2FinalScore)
       {
           return "<p>It was a tie!</p>";
       }
       else
       {
           return "<p>Your opponent won!</p>";
       }
   }
}