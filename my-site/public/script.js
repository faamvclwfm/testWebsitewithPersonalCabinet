const questions = document.querySelectorAll('.question');
const nav = document.getElementById('taskNav');
const buttons = [];
let currentQuestion = 0;

    questions.forEach((q, i) => {
      const btn = document.createElement('button');
      btn.textContent = i + 1;
      btn.onclick = () => showQuestion(i);
      if (i === 0) btn.classList.add('active');
      nav.appendChild(btn);
      buttons.push(btn);
    });

    function showQuestion(index) {
      questions.forEach(q => q.classList.remove('active'));
      questions[index].classList.add('active');

      buttons.forEach(btn => btn.classList.remove('active'));
      buttons[index].classList.add('active');
      currentQuestion = index;
    }

    function checkAnswers() {
      let score = 0;
      const tryAgainButton = document.getElementById('again');
      tryAgainButton.style.display = 'block';
      
      questions.forEach((q, i) => {
        const selected = q.querySelector('input[type="radio"]:checked');
        const isCorrect = selected && selected.value === "1";
    
        q.querySelectorAll('label').forEach(label => {
          label.classList.remove('correct-answer', 'incorrect-answer');
        });
    
        
        q.querySelectorAll('input[type="radio"][value="1"]').forEach(radio => {
          if (radio.nextElementSibling) {
            radio.nextElementSibling.classList.add('correct-answer');
          }
        });
    
        if (selected && !isCorrect && selected.nextElementSibling) {
          selected.nextElementSibling.classList.add('incorrect-answer');
        }
    
        buttons[i].classList.remove('correct', 'incorrect');
        if (isCorrect) {
          score++;
          buttons[i].classList.add('correct');
        } else {
          buttons[i].classList.add('incorrect');
        }
  
        q.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.disabled = true;
        });
        document.getElementById('result').textContent = `Ваш результат: ${score} з ${questions.length}`;
        markTestAsComplete()
      })}
    

    function nextQuestion() {
      // Hide current question
      questions[currentQuestion].classList.remove('active');
      buttons[currentQuestion].classList.remove('active');

      // Move to next question
      currentQuestion = (currentQuestion + 1) % questions.length;

      // Show the next question
      questions[currentQuestion].classList.add('active');
      buttons[currentQuestion].classList.add('active');
    }
    function tryAgain() {
      buttons.length = 0;
      nav.innerHTML = '';
      
      questions.forEach((q, i) => {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.onclick = () => showQuestion(i);
        if (i === 0) btn.classList.add('active');
        nav.appendChild(btn);
        buttons.push(btn);
    
        // Reset all radio buttons and styling
        q.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.disabled = false;
          radio.checked = false;
        });
    
        q.querySelectorAll('label').forEach(label => {
          label.classList.remove('correct-answer', 'incorrect-answer');
        });
      });
      
      showQuestion(0);
      document.getElementById('result').textContent = '';
      document.getElementById('again').style.display = 'none';
    }
    function markTestAsComplete(userId, testId) {
      fetch('/api/complete-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, testId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Test marked as completed!");
        }
      });
    }