var Events = (function () {


    var quizForm = document.querySelector('#quiz-form');

    var quizRestartButton = document.querySelector('#quiz-restart');
    var quizStartButton = document.querySelector('#quiz-start');

    function attachHandlers() {
        quizStartButton.onclick = startQuiz;
        quizRestartButton.onclick = restartQuiz;
        quizForm.onsubmit = submitQuiz;
        quizForm.onchange = Controller.saveAnswers;
    }

    return{
        attachHandlers : attachHandlers,
    }

})();
