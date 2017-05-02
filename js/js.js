var srcURL = "https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json";
var quizJSON = null;
var quizStartButton = document.querySelector('#quiz-start');
var quizForm = document.querySelector('#quiz-form');

function createQuestion(question) {

    var node = document.createElement('div');

    node.className += ' question';
    node.innerHTML += 'Question ' + question['question'];

    var answer = null;
    var label = null;
    var input = null;

    for (var i = 0 ; i < question['answers'].length ; i++){
        answer = document.createElement('div');
        label = document.createElement('label');
        input = document.createElement('input');

        input.type = 'radio';
        input.value = question['answers'][i]['id'];
        input.name = 'question ' + question['answers'][i]['id'];

        label.appendChild(input);
        label.innerHTML += question['question'];
        answer.appendChild(label);
        node.appendChild(answer);
    }

}

function displayQuestions() {
    var questionNode = null;
    if (quizJSON != null) {
        console.log(quizJSON['questions']);
        for( var i = 0 ; i < quizJSON['questions'].length; i++){
            questionNode = createQuestion(quizJSON['questions'][i]);
            quizForm.appendChild(questionNode)
        }
    }
    else {

    }
}

quizStartButton.onclick = displayQuestions;

httpGetQuizAsync(srcURL , storeQuizJSON);

function httpGetQuizAsync(URL, callback)
{

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
    console.log(quizJSON);
}