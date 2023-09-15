let wordPairs = [];
let currentIndex = 0;
let showingAnswer = false;

document.getElementById('submitWords').addEventListener('click', function () {
  const inputArea = document.getElementById('inputArea');
  const inputWords = inputArea.value
    .split('\n')
    .filter((word) => word.trim() !== '');

  if (inputWords.length % 2 !== 0) {
    document.getElementById('errorModal').style.display = 'block';
    return;
  }

  wordPairs = [];
  for (let i = 0; i < inputWords.length; i += 2) {
    wordPairs.push({ question: inputWords[i], answer: inputWords[i + 1] });
  }

  shuffleArray(wordPairs);
  document.getElementById('inputSection').style.display = 'none';
  document.getElementById('flashcards').style.display = 'block';
  displayQuestion();
});

document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('errorModal').style.display = 'none';
});

document.getElementById('nextCard').addEventListener('click', function () {
  currentIndex++;
  if (currentIndex >= wordPairs.length) {
    currentIndex = 0;
  }
  showingAnswer = false; // Reset to show question for next card
  displayQuestion();
});

document.getElementById('showAnswer').addEventListener('click', function () {
  if (showingAnswer) {
    displayQuestion();
  } else {
    displayAnswer();
  }
  showingAnswer = !showingAnswer;
});

function displayQuestion() {
  document.getElementById('wordDisplay').textContent =
    wordPairs[currentIndex].question;
}

function displayAnswer() {
  document.getElementById('wordDisplay').textContent =
    wordPairs[currentIndex].answer;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
document.getElementById('editWords').addEventListener('click', function () {
  document.getElementById('inputSection').style.display = 'block';
  document.getElementById('flashcards').style.display = 'none';
  document.getElementById('inputArea').value = wordPairs
    .map((pair) => pair.question + '\n' + pair.answer)
    .join('\n');
});

function displayAnswer() {
  document.getElementById('wordDisplay').textContent =
    wordPairs[currentIndex].answer;
  document.getElementById('card').classList.add('card-answer');
}

function displayQuestion() {
  document.getElementById('wordDisplay').textContent =
    wordPairs[currentIndex].question;
  document.getElementById('card').classList.remove('card-answer');
}

function downloadWords() {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(wordPairs));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'Flashcards.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

document
  .getElementById('downloadWordsBtn')
  .addEventListener('click', downloadWords);

document.getElementById('uploadInput').addEventListener(
  'change',
  function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const uploadedWordPairs = JSON.parse(e.target.result);
          if (Array.isArray(uploadedWordPairs)) {
            wordPairs = uploadedWordPairs;
            currentIndex = 0; // Reset de huidige index
            displayQuestion(); // Update de weergave om het eerste woordpaar te tonen
            document.getElementById('inputSection').style.display = 'none'; // Verberg het input-gedeelte
            document.getElementById('flashcards').style.display = 'block'; // Toon het flashcard-gedeelte
          } else {
            document.getElementById('invalidFileModal').style.display = 'block';
          }
        } catch (error) {
          document.getElementById('invalidFileModal').style.display = 'block';
        }
      };
      reader.readAsText(file);
    }
  },
  false
);

document
  .getElementById('closeInvalidFileModal')
  .addEventListener('click', function () {
    document.getElementById('invalidFileModal').style.display = 'none';
  });
