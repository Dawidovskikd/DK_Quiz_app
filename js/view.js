var View = (function () {

    var statelessView = document.querySelector('.welcome');
    var quizSubmitButton = document.querySelector('#quiz-submit');
    var quizSummary = document.querySelector('#quiz-summary');
    var quizForm = document.querySelector('#quiz-form');
    var timerContainer = document.querySelector('#quiz-timer');

    function showStatelessView() {
        statelessView.classList.remove('hidden');
        hideOngoingStateView();
        hideSummarySateView();
    }
    function hideAllViews() {
        hideOngoingStateView();
        hideStatelessView();
        hideSummarySateView();
    }
    function hideStatelessView() {
        var statelessView = document.querySelector('.welcome');
        statelessView.classList.add('hidden');
    }
    function showSubmitButton() {
        quizSubmitButton.classList.remove('hidden');
    }
    function hideSubmitButton() {
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
    }
    function hideSummarySateView() {
        quizSummary.classList.add('hidden');
    }
    function showQuestions() {
        quizForm.classList.remove('hidden');

    }
    function hideQuestions() {
        quizForm.classList.add('hidden');
    }
    function showRemainingTime() {
        Controller.updateRemainingTimeContainer();
        timerContainer.classList.remove('hidden');
    }
    function hideRemainingTime() {
        timerContainer.classList.add('hidden');
    }

    return {
        hideAllViews : hideAllViews,
        showStatelessView : showStatelessView,
        showOngoingStateView : showOngoingStateView,
        showSummaryStateView : showSummaryStateView
    }

})();
