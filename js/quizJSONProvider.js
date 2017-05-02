var quizJsonProvider = (function () {



    var getQuizJSON = function () {

        return JSON.parse(xmlHttpReq.responseText);
    };

    return {
        getQuizJSON: getQuizJSON
    }

}());


