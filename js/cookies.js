var Cookies = (function () {

    function setAnswersCookie(serializedAnswers) {
        setCookie('answers' , serializedAnswers , 1);
    }

    function setStartingTimeCookie() {
        setCookie('startTime' , (new Date()).toUTCString() , 1);
    }

    function setQuizStatusCookie(status) {
        quizStatus = status;
        setCookie('quizStatus' , status , 1);
    }


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

    return{
        setAnswersCookie:setAnswersCookie,
        setQuizStatusCookie:setQuizStatusCookie,
        setStartingTimeCookie : setStartingTimeCookie,
        setCookie : setCookie,
        getCookie : getCookie,
    }

})();
