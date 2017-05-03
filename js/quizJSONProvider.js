var QuizJSONProvider = (function () {

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

    return {
        httpGetQuizAsync : httpGetQuizAsync ,
    };

})();


