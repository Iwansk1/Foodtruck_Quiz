let quizData;

async function fetchQuizData() {
  try {
    const response = await fetch('quiz_data.json');
    quizData = await response.json();
    initializeQuiz();
  } catch (error) {
    console.error('Error loading quiz data:', error);
  }
}

function initializeQuiz() {
  let currentQuestion = 0;
  const userAnswers = [];
  const questionContainer = document.getElementById('quiz-question');

  function displayQuestion() {
    const { question, choices } = quizData.questions[currentQuestion];
    const choicesContainer = document.getElementById('quiz-choices');

    questionContainer.textContent = question;
    choicesContainer.innerHTML = "";

    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.textContent = `${choice.text} (${choice.value})`;
      button.onclick = () => {
        selectAnswer(index, choice.value);
        nextQuestion();
      };
      choicesContainer.appendChild(button);
    });
  }

  function selectAnswer(choiceIndex, value) {
    const selectedChoice = quizData.questions[currentQuestion].choices[choiceIndex];
    userAnswers.push({ text: selectedChoice.text, value });
    
    //* Clear selected class from all buttons
    document.querySelectorAll('#quiz-choices button').forEach(button => button.classList.remove('selected'));
  }

  function nextQuestion() {
    if (currentQuestion < quizData.questions.length - 1) {
      currentQuestion++;
      displayQuestion();
    } else {
      displayResult();
    }
  }

  function displayResult() {
    const resultContainer = document.getElementById('quiz-result');
  
    //* Calculate total value for all answers
    const totalValue = userAnswers.reduce((total, answer) => {
      console.log(`Answer: ${answer.text}, Value: ${answer.value}`);
      return total + answer.value;
    }, 0);
  
    console.log(`Total Value: ${totalValue}`);
  
    //* Find the personality based on the total value
    const matchingPersonality = quizData.personalities.find(personality => 
      totalValue >= personality.minValue && totalValue <= personality.maxValue
    );
  
    console.log('You are a:', matchingPersonality);
    
    //* Displaying the personality message and the fitting image
    resultContainer.innerHTML = `<strong>You are a: ${matchingPersonality ? matchingPersonality.message.split('.').join('<br> </strong>') : "Undefined Personality"}
    ${matchingPersonality ? `<div> <br><img src="${matchingPersonality.image}" alt="Personality Image" style="max-width: 100%; border-radius: 3px;"></div>` : ''}`;
  
    //* Disable all buttons after displaying result
    document.querySelectorAll('#quiz-choices button').forEach(button => button.remove());

    //* Remove the content of the question container
    questionContainer.innerHTML = '';
  }

  displayQuestion();
}

//* Initiate fetching quiz data
fetchQuizData();
