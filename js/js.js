var srcURL = "https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json";

var quizStatus = Cookies.getCookie('quizStatus');



if (quizStatus == '') {
    //New session
    QuizJSONProvider.httpGetQuizAsync(srcURL , Model.storeQuizJSON);
    View.showStatelessView();
}
else if ( quizStatus == 'ongoing'){
    //continue previous session

    Model.updateQuizJSON();
    Model.updateRemainingTime();
    if (Model.getRemainingTime() >= 0){
        View.hideAllViews();
        Controller.createQuestions();
        Controller.loadAnswersToForm();
        View.showOngoingStateView();
    }
    else {
        // Quiz was ongoing but time run out
        Controller.updateQuizStatus('ended');
        View.hideAllViews();
        View.showSummaryStateView();
    }
}
else if (quizStatus == 'ended' ) {
    //Show previous quiz summary
    View.hideAllViews();
    Controller.createSummary();
    View.showSummaryStateView();
}

Timer.initTimer();
Events.attachHandlers();

function startQuiz () {
    View.hideAllViews();
    Timer.startTimer();
    Model.updateRemainingTime();
    Controller.createQuestions();
    View.showOngoingStateView();
    window.scrollTo(0,0);
    Controller.updateQuizStatus('ongoing');
}
function submitQuiz(e) {
    e.preventDefault();
    View.hideAllViews();
    Cookies.setAnswersCookie(Controller.serializeQuizForm());
    Controller.createSummary();
    View.showSummaryStateView();
    window.scrollTo(0,0);
    Cookies.setQuizStatusCookie('ended');
}
function restartQuiz() {
    Cookies.setCookie('answer' , 0 , -1 );
    Controller.resetQuizForm();
    startQuiz();
}