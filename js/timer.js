var Timer = (function () {

    var quizSubmitButton = document.querySelector('#quiz-submit');
    var startTime = new Date(Cookies.getCookie('startTime'));
    var currentTime = new Date();

    function getStartTime() {
        return startTime;
    }

    function getCurrentTime() {
        return currentTime;
    }

    function timeController() {
        currentTime = new Date();

        if (quizStatus == 'ongoing'){
            Model.updateRemainingTime();
            if( Model.getRemainingTime() <= 0 ){
                // quizForm.submit() does not trigger submit event so below is a way around
                quizSubmitButton.click();
            }
            else {
                Controller.updateRemainingTimeContainer();
            }
        }
    }

    function startTimer() {
        Cookies.setStartingTimeCookie();
        startTime = new Date( Cookies.getCookie('startTime') );
    }

    function initTimer() {
        setInterval(Timer.timeController , 1000);
    }

    return{
        getStartTime : getStartTime,
        getCurrentTime : getCurrentTime,
        startTimer : startTimer,
        timeController : timeController,
        initTimer : initTimer,
    }

})();
