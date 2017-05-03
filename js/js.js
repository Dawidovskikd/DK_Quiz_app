var srcURL = "https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json";
var quizQuestionsInitialized = false;
var score = 0;
var quizJSON = ( (getCookie('quizJSON') != '') ? JSON.parse(getCookie('quizJSON')) : null ) ;
var quizForm = document.querySelector('#quiz-form');
var quizStatus = getCookie('quizStatus');
var quizRestartButton = document.querySelector('#quiz-restart');
var quizStartButton = document.querySelector('#quiz-start');
var quizSubmitButton = document.querySelector('#quiz-submit');
var quizSummary = document.querySelector('#quiz-summary');
var quizWelcomeText = document.querySelector('.welcome_text');
var timerContainer = document.querySelector('#quiz-timer');
var startTime = new Date(getCookie('startTime'));
var currentTime = new Date();
var currentTimeTimerHandler = setInterval(timeController , 1000);
var remainingTime = 0;

quizStartButton.onclick = startQuiz;
quizRestartButton.onclick = restartQuiz;
quizForm.onsubmit = submitQuiz;
quizForm.onchange = saveAnswers;


if (quizStatus == '') {
    //New session
    httpGetQuizAsync(srcURL , storeQuizJSON);
    showStatelessView();
}
else if ( quizStatus == 'ongoing'){
    //continue previous session
    updateRemainingTime();
    if (remainingTime >= 0){
        hideAllViews();
        showOngoingStateView();
        loadAnswersToForm();
    }
    else {
        // Quiz was ongoing but time run out
        updateQuizStatus('ended');
        hideAllViews();
        showSummaryStateView();
    }
}
else if (quizStatus == 'ended' ) {
    //Show previous quiz summary
    hideAllViews();
    createSummary();
    showSummaryStateView();
}

//---------- State changing functions ----------//

function startQuiz () {
    hideAllViews();
    startTimer();
    updateRemainingTime();
    showOngoingStateView();
    updateQuizStatus('ongoing');
}
function submitQuiz(e) {
    e.preventDefault();
    hideAllViews();
    setAnswersCookie(serializeQuizForm());
    createSummary();
    showSummaryStateView();
    setQuizStatusCookie('ended');
}
function restartQuiz() {
    setCookie('answer' , 0 , -1 );
    quizForm.reset();
    startQuiz();
}

//--------- View control function ---------//

function hideAllViews() {
    hideOngoingStateView();
    hideStatelessView();
    hideSummarySateView();
}
function showStatelessView() {
    showWelcomeText();
    showStartButton();
    hideOngoingStateView();
    hideSummarySateView();
}
function hideStatelessView() {
    hideWelcomeText();
    hideStartButton();
}
function showSubmitButton() {
    quizSubmitButton.classList.remove('hidden');
    quizSubmitButton.classList.add('visible');
}
function hideSubmitButton() {
    quizSubmitButton.classList.remove('visible');
    quizSubmitButton.classList.add('hidden');
}
function showOngoingStateView() {
    showRemainingTime();
    showQuestions();
    showSubmitButton();
}
function hideOngoingStateView() {
    hideRemainingTime();
    hideQuestions();
    hideSubmitButton();
}
function showSummaryStateView() {
    quizSummary.classList.remove('hidden');
    quizSummary.classList.add('visible');
}
function hideSummarySateView() {
    quizSummary.classList.remove('visible');
    quizSummary.classList.add('hidden');
}
function showWelcomeText() {
    quizWelcomeText.classList.remove('hidden');
    quizWelcomeText.classList.add('visible');
}
function hideWelcomeText() {
    quizWelcomeText.classList.remove('visible');
    quizWelcomeText.classList.add('hidden');
}
function showStartButton() {
    quizStartButton.classList.remove('hidden');
    quizStartButton.classList.add('visible');
}
function hideStartButton() {
    quizStartButton.classList.remove('visible');
    quizStartButton.classList.add('hidden');
}
function showQuestions() {
    if ( !quizQuestionsInitialized ){
        var questionNode = null;

        for( var i = 0 ; i < quizJSON['questions'].length; i++){
            questionNode = createQuestion(quizJSON['questions'][i] , ( i + 1 ) );
            quizForm.appendChild(questionNode)
        }

        quizQuestionsInitialized = true;
    }

    quizForm.classList.remove('hidden');
    quizForm.classList.add('visible');

}
function hideQuestions() {
    quizForm.classList.remove('visible');
    quizForm.classList.add('hidden');
}
function showRemainingTime() {
    updateRemainingTimeContainer();
    timerContainer.classList.remove('hidden');
    timerContainer.classList.add('visible');
}
function hideRemainingTime() {
    timerContainer.classList.remove('visible');
    timerContainer.classList.add('hidden');
}

function createQuestionSummary(question, answer) {
    var questionNode = document.createElement('div');
    var questionTitle = document.createElement('h4');
    var answerNode = document.createElement('div');

    questionNode.classList.add('question');
    questionNode.appendChild(questionTitle);
    questionTitle.innerText = question['question'];

    for (var i =0 ; i< question['answers'].length ; i++){
        answerNode = document.createElement('div');
        answerNode.classList.add('answer');
        answerNode.innerText = question['answers'][i]['answer'];

        if( question['answers'][i]['id'] == answer ){
            answerNode.classList.add( (question['answers'][i]['correct']) ? 'correct' : 'incorrect' );
            questionNode.appendChild(answerNode);
            answerNode.classList.remove('correct,incorrect');
        }
        else {
            questionNode.appendChild(answerNode);
        }
    }

    return questionNode;
}
function updateScore() {
    var answers = JSON.parse(getCookie('answers'));
    var questionsWithAnswers = Object.keys(answers);
    var questionID;

    score = 0;
    for (var i = 0 ; i <  questionsWithAnswers.length ; i++){
        questionID = questionsWithAnswers[i].match(/\d+/g)[0];

        if ( quizJSON['questions'][questionID - 1 ]['answers'][answers[questionsWithAnswers[i]] - 1]['correct'] ){
            score++;
        }
    }
}
function updateScoreView() {
    var scoreContainer = document.querySelector('#score');

    updateScore();
    scoreContainer.innerText = score;
}
function createSummary() {
    var answers = JSON.parse(getCookie('answers'));
    var summaryDiv = document.querySelector('#questions-summary');
    var questionNode;

    updateScoreView();

    summaryDiv.innerHTML = '';
        for( var i = 0 ; i < quizJSON['questions'].length; i++){
        questionNode = createQuestionSummary(quizJSON['questions'][i] , answers['question-' + quizJSON['questions'][i]['id']] );
        summaryDiv.appendChild(questionNode)
    }

}
function createQuestion(question, index) {

    var node = document.createElement('div');

    node.className += ' question';
    node.innerHTML += '<h4>' +  'Question ' + index + ': ' + question['question'] + '</h4>';

    var answer = null;
    var label = null;
    var input = null;

    for (var i = 0 ; i < question['answers'].length ; i++){
        answer = document.createElement('div');
        answer.className += ' answer';
        label = document.createElement('label');
        input = document.createElement('input');

        input.type = 'radio';
        input.value = question['answers'][i]['id'];
        input.name = 'question-' + index;

        label.appendChild(input);
        label.innerHTML += question['answers'][i]['answer'] ;
        answer.appendChild(label);
        node.appendChild(answer);
    }

    return node;

}

function updateQuizStatus(newStatus) {
    quizStatus = newStatus;
    setQuizStatusCookie(newStatus);
}
function setQuizStatusCookie(status) {
    setCookie('quizStatus' , status , 1);
}
function setAnswersCookie(serializedAnswers) {
    setCookie('answers' , serializedAnswers , 1);
}
function serializeQuizForm() {
    return JSON.stringify(getAnswerList());
}
function saveAnswers() {
    setAnswersCookie(serializeQuizForm());
}
function loadAnswersToForm() {
    var answers = JSON.parse(getCookie('answers'));
    var answersKeys = Object.keys(answers);
    for (var i = 0 ; i < answersKeys.length ; i++ ){
        var inputToCheck = document.querySelector('input[name='+ answersKeys[i] +'][value="' + answers[answersKeys[i]] + '"]');
        inputToCheck.checked = true;
    }
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

//---------- Time control functions ----------//

function updateRemainingTime() {
    remainingTime = Math.floor(quizJSON['time_seconds'] - (currentTime - startTime)/1000);
}
function updateRemainingTimeContainer() {
    var remainingTimeContainer = document.querySelector('#remaining-time');
    remainingTimeContainer.innerHTML = remainingTime;
}
function timeController() {
    currentTime = new Date();

    if (quizStatus == 'ongoing'){
        updateRemainingTime();
        if( remainingTime <= 0 ){
            // quizForm.submit() does not trigger submit event so below is a way around
            quizSubmitButton.click();
        }
        else {
            updateRemainingTimeContainer();
        }
    }
}
function startTimer() {
    setStartingTimeCookie();
    startTime = new Date( getCookie('startTime') );
}
function setStartingTimeCookie() {
    setCookie('startTime' , (new Date()).toUTCString() , 1);
}

//---------- HTTP request for data ----------//

function httpGetQuizAsync(URL, callback){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(JSON.parse(xmlHttp.responseText));
        }
    };
    xmlHttp.open("GET", URL, true);
    xmlHttp.send(null);
}
function storeQuizJSON(JSONToStore) {
    quizJSON = JSONToStore;
    setCookie('quizJSON' , JSON.stringify(quizJSON) , 1);
}

// Pre-written functions of lower level

//https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}