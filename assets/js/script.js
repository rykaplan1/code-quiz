//Global Variables
let timeCounter;
let currentScreen;
let previousScreen;
let currentCorrectAnswer;
let isCorrect;
let nextQuestion;
let timeInterval;
const questions = [
  {
  questionText: "Commonly used data types DO NOT include:",
  answerText: ["strings", "booleans", "alerts", "numbers"],
  correctAnswer: "alerts"
  }, {
    questionText: "The condition in an if / else statement is enclosed within ___.",
    answerText: ["quotes", "curly brackets", "parentheses", "square brackets"],
    correctAnswer: "parentheses"
  }, {
    questionText: "Arrays in JavaScript can be used to store ___.",
    answerText: ["numbers and strings", "other arrays", "booleans", "all of the above"],
    correctAnswer: "all of the above"
  }, {
    questionText: "String values must be enclosed within ___ when assigned to variables.",
    answerText: ["commas", "curly brackets", "quotes", "parentheses"],
    correctAnswer: "quotes"
  }, {
     questionText: "A very useful tool used during development and debugging for printing content to the debugger is:",
    answerText: ["JavaScript", "terminal/bash", "for loops", "console.log"],
    correctAnswer: "console.log"
  }
];

//Header Elements
const viewScores = document.getElementById('view-scores');
const time = document.getElementById('time');

//Start Screen Elements
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

//Question Screen Elements
const questionScreen = document.getElementById('question-screen');
const question = document.getElementById('question');
const answers = document.getElementsByClassName('answer');
const answerOne = document.getElementById('answer-one');
const answerTwo = document.getElementById('answer-two');
const answerThree = document.getElementById('answer-three');
const answerFour = document.getElementById('answer-four');
const judgment = document.getElementById('judgment');

//Results Screen Elements
const resultsScreen = document.getElementById('results-screen');
const score = document.getElementById('score');
const initials = document.getElementById('initials');
const submit = document.getElementById('submit');

//Scores Screen Elements
const scoresScreen = document.getElementById('scores-screen');
const scoreList = document.getElementById('score-list');
const goBack = document.getElementById('go-back');
const clearScores = document.getElementById('clear-scores');

//Functions
// Shuffle an array using Fisher-Yates shuffle algorithm (adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there are still elements left to shuffle...
  while (currentIndex != 0) {
    // Pick a remaaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // ...and swap it with the current element
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]] 
  }
}

const init = () => {
  startScreen.style.display = 'block';
  questionScreen.style.display = 'none';
  judgment.style.display = 'none';
  resultsScreen.style.display = 'none';
  scoresScreen.style.display = 'none';
  timeCounter = 75;
  time.innerText = timeCounter;
  currentScreen = startScreen;
};

const showHighScores = (scoreSubmitted = false) => {
  if (!localStorage.getItem('Scores')) {
    localStorage.setItem('Scores', (JSON.stringify([])));
  }
  storedScores = JSON.parse(localStorage.getItem('Scores'));
  if (scoreSubmitted) {
    storedScores.push({name: initials.value.toUpperCase(), score: timeCounter});
    scoreSubmitted = false;
  }
  storedScores.sort((a, b) => b.score - a.score);
  for (i = 0; i < 10; i++) {
    if (storedScores.length <= i) {
      break;
    }
    const player = storedScores[i];
    scoreList.innerHTML += `<li>${player.name} - ${player.score}</li>`;
  }
  currentScreen.style.display = 'none';
  scoresScreen.style.display = 'block';
  viewScores.disabled = true;
  previousScreen = currentScreen;
  currentScreen = scoresScreen;
  localStorage.setItem('Scores', JSON.stringify(storedScores));
};

const renderQuestion = (questionObj) => {
  question.innerText = questionObj.questionText;
  const answers = questionObj.answerText;
  shuffleArray(answers);
  answerOne.innerText = answers[0];
  answerTwo.innerText = answers[1];
  answerThree.innerText = answers[2];
  answerFour.innerText = answers[3];
  currentCorrectAnswer = questionObj.correctAnswer;
};

const checkAnswer = (answerText) => {
  isCorrect = (answerText === currentCorrectAnswer);
}

const goToResults = () => {
  score.innerText = timeCounter;
  questionScreen.style.display = 'none';
  resultsScreen.style.display = 'block'; 
  currentScreen = resultsScreen;
};

//Event Listeners
viewScores.addEventListener('click', function() {
  if (currentScreen !== scoresScreen) {
    showHighScores();
  }
});

startButton.addEventListener('click', function() {
  startScreen.style.display = 'none';
  questionScreen.style.display = 'inline-flex';
  currentScreen = questionScreen;
  currentQuestion = 0;
  nextQuestion = 1;
  renderQuestion(questions[currentQuestion]);
  timeInterval = setInterval(function() {
    if (timeCounter > 0) {
      timeCounter--;
      time.innerText= timeCounter;
    } else {
      clearInterval(timeInterval);
      goToResults();
    }
  }, 1000);
});

Array.from(answers).forEach((answer) => {
  answer.addEventListener('click', () => {
    checkAnswer(answer.innerText);
    if (isCorrect) {
      judgment.innerText = "Correct!";
    } else {
      if (timeCounter > 0) {
        timeCounter -= 10;
        if (timeCounter < 0) {
          timeCounter = 0;
        }
        time.innerText = timeCounter;
      }
      judgment.innerText = "Wrong!";
    }
    judgment.style.display = 'block';
    const hideJudgment = setTimeout(function() {
      judgment.style.display = 'none';
    }, 2000);
    if (nextQuestion < questions.length) {
      renderQuestion(questions[nextQuestion]);
      currentQuestion = nextQuestion;
      nextQuestion = currentQuestion + 1;
    } else {
      clearInterval(timeInterval);
      goToResults();
    }
  })
});

submit.addEventListener('click', function() {
  if (initials.value.length <= 3 && /^[a-zA-Z]+$/.test(initials.value)) {
    showHighScores(true);
  } else {
    alert("Please enter only letters or no more than three letters.");
  }
  initials.value = null;
});

goBack.addEventListener('click', function() {
  scoresScreen.style.display = 'none';
  scoreList.innerHTML = '';
  if (previousScreen === resultsScreen) {
    init();
  } else if (previousScreen === questionScreen) {
    previousScreen.style.display = 'inline-flex';
    currentScreen = previousScreen;
  } else {
    previousScreen.style.display = 'block';
    currentScreen = previousScreen;
  }
  viewScores.disabled = false;
});

clearScores.addEventListener('click', function() {
  clearInput = confirm("Are you sure you want to clear all high scores?");
  if (clearInput) {
    localStorage.setItem('Scores', (JSON.stringify([])));
    scoreList.innerHTML = '';
  }
});

//Main Script
init();