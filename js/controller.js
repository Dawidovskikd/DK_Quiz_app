var Controller = (function () {

    var quizQuestionsInitialized = false;
    var quizForm = document.querySelector('#quiz-form');

    function createQuestion(question, index) {

        var node = document.createElement('div');
        var sg_radio;
        var answer = null;
        var label = null;
        var input = null;
        var id = '';

        node.className += ' question';
        node.innerHTML += '<h4>' +  'Pytanie ' + index + ': ' + question['question'] + '</h4>';

        for (var i = 0 ; i < question['answers'].length ; i++){
            sg_radio = document.createElement('div');

            id = 'answer-' + index + '-' + i;
            sg_radio.innerHTML =
                '<div class="sg-label sg-label--secondary answer">\
                    <div class="sg-label__icon">\
                        <div class="sg-radio">\
                            <input class="sg-radio__element" type="radio" id="' + id + '" value="'+ question['answers'][i]['id'] + '" name="' + 'question-' + index + '">\
                        <label class="sg-radio__ghost" for="' + id + '"></label>\
                    </div>\
                </div>\
                <label class="sg-label__text" for="' + id + '">' +  question['answers'][i]['answer'] + '</label>\
            </div>';

            node.appendChild(sg_radio);
        }

        return node;

    }

    function createQuestions() {
        var quizJSON = Model.getQuizJSON();

        if ( !quizQuestionsInitialized ){
            var questionNode = null;

            for( var i = 0 ; i < quizJSON['questions'].length; i++){
                questionNode = createQuestion(quizJSON['questions'][i] , ( i + 1 ) );
                quizForm.appendChild(questionNode)
            }

            quizQuestionsInitialized = true;
        }
    }

    function createSummary() {
        var answers = JSON.parse(Cookies.getCookie('answers'));
        var summaryDiv = document.querySelector('#questions-summary');
        var questionNode;
        var quizJSON = Model.getQuizJSON();

        updateScoreView();

        summaryDiv.innerHTML = '';
        for( var i = 0 ; i < quizJSON['questions'].length; i++){
            questionNode = createQuestionSummary(quizJSON['questions'][i] , answers['question-' + quizJSON['questions'][i]['id']] );
            summaryDiv.appendChild(questionNode)
        }

    }

    function createQuestionSummary(question, answer) {
        var questionNode = document.createElement('div');
        var questionTitle = document.createElement('h4');
        var answerNode = document.createElement('div');

        questionNode.classList.add('question');
        questionNode.appendChild(questionTitle);
        questionTitle.innerText = 'Pytanie ' + question['id'] + ': ' + question['question'];

        for (var i =0 ; i< question['answers'].length ; i++){
            answerNode = document.createElement('div');
            answerNode.classList.add('answer');
            answerNode.innerText = question['answers'][i]['answer'];

            if( question['answers'][i]['id'] == answer ){
                answerNode.classList.add( (question['answers'][i]['correct']) ? 'correct' : 'incorrect' );
                questionNode.appendChild(answerNode);
            }
            else {
                questionNode.appendChild(answerNode);
            }
        }

        return questionNode;
    }

    function updateQuizStatus(newStatus) {
        quizStatus = newStatus;
        Cookies.setQuizStatusCookie(newStatus);
    }

    function updateScoreView() {
        var scoreContainer = document.querySelector('#score');

        Model.updateScore();
        scoreContainer.innerText = Model.getScore();
    }


    function loadAnswersToForm() {

        var cookiesAnswers = Cookies.getCookie('answers');

        if ( cookiesAnswers != '' ) {
            var answers = JSON.parse(Cookies.getCookie('answers'));
            var answersKeys = Object.keys(answers);
            for (var i = 0; i < answersKeys.length; i++) {
                var inputToCheck = document.querySelector('input[name=' + answersKeys[i] + '][value="' + answers[answersKeys[i]] + '"]');
                inputToCheck.checked = true;
            }
        }

    }

    function resetQuizForm() {
        quizForm.reset();
    }

    function saveAnswers() {
        Cookies.setAnswersCookie(serializeQuizForm());
    }

    function serializeQuizForm() {
        return JSON.stringify(getAnswerList());
    }
    function getAnswerList() {
        var inputList = document.querySelectorAll('#quiz-form input');
        var answerList = {};

        for (var i = 0; i< inputList.length ; i++ ){
            if( inputList[i].checked == true ){
                answerList[inputList[i].name] = inputList[i].defaultValue
            }
        }

        return answerList;
    }

    function updateRemainingTimeContainer() {
        var remainingTimeContainer = document.querySelector('#remaining-time');
        remainingTimeContainer.innerHTML = Model.getRemainingTime();
    }

    return{
        createQuestions : createQuestions,
        updateQuizStatus : updateQuizStatus,
        createSummary : createSummary,
        loadAnswersToForm :loadAnswersToForm,
        resetQuizForm : resetQuizForm,
        saveAnswers : saveAnswers,
        serializeQuizForm : serializeQuizForm,
        updateRemainingTimeContainer : updateRemainingTimeContainer,
    }

})();
