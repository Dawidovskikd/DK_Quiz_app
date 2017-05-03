var Model = (function () {

    var remainingTime = 0;
    var score = 0;
    var quizJSON;

    function updateQuizJSON() {
        quizJSON = JSON.parse( Cookies.getCookie('quizJSON'));
    }

    function storeQuizJSON(JSONToStore) {
        quizJSON = JSONToStore;
        Cookies.setCookie('quizJSON' , JSON.stringify(quizJSON) , 1);
    }

    function updateRemainingTime() {
        remainingTime = Math.floor(quizJSON['time_seconds'] - (Timer.getCurrentTime() - Timer.getStartTime() )/1000);
    }
    function updateScore() {
        var answers = JSON.parse( Cookies.getCookie('answers'));
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

    function getQuizJSON() {
        return quizJSON;
    }

    function getScore() {
        return score;
    }

    function getRemainingTime() {
        return remainingTime;
    }

    return{
        getRemainingTime : getRemainingTime,
        getScore : getScore,
        getQuizJSON : getQuizJSON,
        storeQuizJSON : storeQuizJSON,
        updateRemainingTime : updateRemainingTime,
        updateScore : updateScore,
        updateQuizJSON : updateQuizJSON,
    }

})();
