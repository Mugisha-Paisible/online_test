var score = 0;
var quizDuration = 0;
var quizSecondElapsed = 0;
var quizInterval;
var questionDuration = quizDuration;
var questionSecondElapsed = 0;
var questionInterval;
var currentQuestion = 0;
var testId;
var quizTimer = document.getElementById("quizTimer");
var quiz = document.getElementById("quiz");
var timerTable = document.getElementById("timer");
var randomQuestions;

var questions = [];

window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
};

function init() {

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://onlinetestapplication.herokuapp.com/questions", true);
    //xhttp.open("GET", "http://localhost:3000/questions", true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            for(var count=0; count<JSON.parse(this.responseText).length; count++) {
                questions.push(JSON.parse(this.responseText)[count]);
            }

            for(var count=0; count<questions.length; count++) {
                questions[count].choices = [questions[count].choiceOne, questions[count].choiceTwo, questions[count].choiceThree, questions[count].choiceFour];
                questions[count].answer = [questions[count].answerText];
            }
        }
    };
    xhttp.send();

    clear();
    reset();

    document.getElementById('attemptedIcon').style.visibility = "hidden";
    document.getElementById('unattemptedIcon').style.visibility = "hidden";
    document.getElementById('flaggedIcon').style.visibility = "hidden";
    
    let testIdLabel = document.createElement("label");
    testIdLabel.setAttribute("for", "name");
    testIdLabel.setAttribute("id", "name");
    testIdLabel.textContent = "Enter test ID : ";
    let testIdInput = document.createElement("input");
    testIdInput.setAttribute("id", "name");
    testIdInput.setAttribute("name", "name");
    let lb = document.createElement("br");
    quiz.appendChild(testIdLabel);
    quiz.appendChild(testIdInput);
    quiz.appendChild(lb);
    let startQuiz = document.createElement("button");
    startQuiz.setAttribute("id", "startQuiz");
    startQuiz.textContent = "START";
    quiz.appendChild(startQuiz);

    testId = Math.round((Math.random())*1000000);
    testIdInput.value = testId;

    startQuiz.addEventListener("click", function(){
        //document.getElementById('onlineTest').style.visibility = "hidden";
        if((testId!="") && (questions.length>0)) {

            document.getElementById('unattempted').textContent = questions.length;

            document.getElementById('questionBox').style.width = "auto";

            //document.getElementById('logo').style.left = "32%";

            document.getElementById('questionBox').style.left = "550px";
            document.getElementById("instr").style.display = "none";
            document.getElementById("instructions").style.display = "none";
            randomQuestions = rQuestions(questions);
            sidebar(randomQuestions);
            startquiz(randomQuestions);
            
        }
    })
}

function clear() {
    quiz.innerHTML = "";
}

function sidebar(randomQuestions) {
    var side = document.getElementById("sidebar");
    side.className = "sb";
    side.style.visibility = "visible";
    for(let i = 0; i < questions.length; i++){
        let sideQuestion = document.createElement("li");
        sideQuestion.setAttribute("id", i + 1);
        sideQuestion.setAttribute("style", "list-style-type:none");
        sideQuestion.textContent = i + 1;
        side.appendChild(sideQuestion);
    }
    side.addEventListener("click", function() {
        toggleSidebar(randomQuestions);
    })
}

function toggleSidebar(randomQuestions) {
    let e = event.target;
    if(e.matches("li")){
        let questionno = e.textContent;
        showQuestion(Number(questionno) - 1, randomQuestions);
    }
}

function reset() {
    score = 0;
    quizDuration = 0;
    quizSecondElapsed = 0;
    currentQuestion = 0;
    questionDuration = quizDuration;
    questionSecondElapsed = 0;
    questionInterval;
    for(let i = 0; i < questions.length; i++){
        questions[i].marked = false;
    }
    quizInterval;
}

function startquiz(randomQuestions){

    timerTable.style.visibility = "visible";
    document.getElementById('status').style.visibility = "visible";
    document.getElementById('score').style.visibility = "hidden";
    quizDuration = questions.length * 60;

    startTimer();
    time();
    showQuestion(currentQuestion, randomQuestions);
}

function rQuestions(arr) {
    var randomQuestions = [];
    var result = [], randNumber,Count=questions.length;
    while ( Count > 0) {
        randNumber = Math.round(Math.random() * (questions.length - 1));
        if (result.indexOf(randNumber) == -1) {
            result.push(randNumber);
            Count--;
        }
    }
    for(let i = 0; i < questions.length; i++) {
        randomQuestions[i] = arr[result[i]];
        randomQuestions[i].number = i + 1;
        randomQuestions[i].userAnswer = [];
    }
    return randomQuestions;
}

function startTimer() {
    clearInterval(quizInterval);
    quizSeconds = quizDuration;
    quizInterval = setInterval(function() {
        quizSecondElapsed++;
        questionSecondElapsed++;
        time();
    }, 1000);
}

function time() {
    let s = quizDuration - quizSecondElapsed;
    function fmtMSS(s){
        if(s<60) {
            quizTimer.style.color = "red";
            setInterval(function() {
                quizTimer.style.visibility = (quizTimer.style.visibility == 'hidden' ? '' : 'hidden');
            }, 1000);
        }
        if(s<0){
            quizTimer.style.visibility = "hidden";
        }
        return(s-(s%=60))/60+(9<s?':':':0')+s;
    }
    let content = fmtMSS(s);
    quizTimer.textContent = content;
    if((quizDuration - quizSecondElapsed) < 1){
        endQuiz();
    }
}

var attempted = 0;
var flagged = 0;
document.getElementById('attempted').textContent = 0;
document.getElementById('flagged').textContent = 0;
document.getElementById('unattempted').textContent = questions.length;
let selectedItems = [];



function showQuestion(i, randomQuestions) {

    document.getElementById('attemptedIcon').style.visibility = "visible";
    document.getElementById('unattemptedIcon').style.visibility = "visible";
    document.getElementById('flaggedIcon').style.visibility = "visible";

    document.getElementById('watermark').style.display = 'inline-block';

    clear();
    questionSecondElapsed = 0;
    currentQuestion = i;
    if(i == randomQuestions.length){
        endQuiz();
        return;
    }
    let question = document.createElement("h1");
    question.setAttribute("question", randomQuestions[i].question);
    question.setAttribute("id", "question")

    let qnNo = document.createElement("div");
    qnNo.setAttribute('id', 'qnNo');
    qnNo.textContent = 'Q' + eval(i + 1) + '. ';

    question.appendChild(qnNo);

    let qnStmt = document.createElement("div");
    qnStmt.setAttribute('id', 'qnStmt');
    qnStmt.textContent = randomQuestions[i].question;

    question.appendChild(qnStmt);

    quiz.appendChild(question);
    let choicebox = document.createElement("div");
    choicebox.setAttribute("id", "choicebox");
    quiz.append(choicebox);
    for(let j = 0; j < randomQuestions[i].choices.length; j++){

        let option = document.createElement("p");
        option.setAttribute("class", "choices");
        
        let checkBox = document.createElement('INPUT');
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("class", "checkBox");
        checkBox.setAttribute("value", "choice-" + j);
        checkBox.setAttribute("name", "checkBox-" + j);
        checkBox.setAttribute("id", "checkBox-" + j);

        let label = document.createElement('label');
        label.setAttribute("for", "checkBox-" + j);
        label.setAttribute('class', 'choiceStatement')

        option.appendChild(checkBox);
        option.appendChild(label);

        let optionNo = j+1;
        if(optionNo==1) {
            label.textContent += ' a. ' + randomQuestions[i].choices[j];
        }else if(optionNo==2) {
            label.textContent += ' b. ' + randomQuestions[i].choices[j];
        }else if(optionNo==3) {
            label.textContent += ' c. ' + randomQuestions[i].choices[j];
        }else {
            label.textContent += ' d. ' + randomQuestions[i].choices[j];
        }
        // label.textContent += randomQuestions[i].choices[j];
        if(randomQuestions[i].marked && randomQuestions[i].answer == randomQuestions[i].choices[j]){
            //listchoice.setAttribute("style", "background-color: green; color: white");
        }
        if(randomQuestions[i].userAnswer) {
            for(x=0; x<randomQuestions[i].userAnswer.length; x++){
                if(randomQuestions[i].userAnswer[x]== randomQuestions[i].choices[j]){
                    //attempted
                    //option.setAttribute("style", "background-color: #088a85; color: white");
                    checkBox.setAttribute("checked", "true");
                }
            }
        }   
        choicebox.appendChild(option);
    }
    choicebox.addEventListener("click", function () {
        scoreAnswer(randomQuestions[i]);
    })
    let previous = document.createElement("button");
    previous.setAttribute("id", "previous");
    previous.textContent = "Previous";
    
    
    quiz.appendChild(previous);
    if(i == 0){
        previous.style.visibility = "hidden";
    }

    let flag = document.createElement("button");
    flag.setAttribute("id", "flag");
    flag.textContent = "Mark for Review";
    
    quiz.appendChild(flag);

    let next = document.createElement("button");
    next.setAttribute("id", "next");
    
    if(i == randomQuestions.length - 1){
        next.textContent = "Submit";
    }else{
        next.textContent = "Next";
    }

    quiz.appendChild(next);

    previous.addEventListener("click", function () {
        selectedItems = [];
        currentQuestion--;
        showQuestion(currentQuestion, randomQuestions);
    })
    flag.addEventListener("click", function() {
        if(randomQuestions[i].flagState == false) {
            if(randomQuestions[i].marked) {
                flagged++;
                attempted--;
            } else if(!randomQuestions[i].marked) {
                flagged++;
            }
            //flagged
            document.getElementById(randomQuestions[i].number).style.backgroundColor = "cornflowerblue";
            //flagged++;
            randomQuestions[i].flagState = true;
            this.textContent = 'Unmark for review';
        } else {
            if(randomQuestions[i].marked) {
                flagged--;
                attempted++;
            } else if(!randomQuestions[i].marked) {
                flagged--;
            }
            this.textContent = 'Mark for review';
            if(!randomQuestions[i].marked) {
                // document.getElementById(randomQuestions[i].number).style.backgroundColor = "#51adcf"; 
                //initial question panel colot
                
                // document.getElementById(randomQuestions[i].number).style.backgroundColor = "#e0e6e0";
                document.getElementById(randomQuestions[i].number).style.backgroundColor = "#ec5858";
                

            } else {
                //attempted
                document.getElementById(randomQuestions[i].number).style.backgroundColor = "#088a85";
            }
            //flagged--;
            randomQuestions[i].flagState = false;
        }

        document.getElementById('flagged').textContent = flagged;
        document.getElementById('attempted').textContent = attempted;
        document.getElementById('unattempted').textContent = questions.length - attempted - flagged;
    })
    next.addEventListener("click", function(){
        selectedItems = [];
        currentQuestion++;
        if((!randomQuestions[i].marked) && (!randomQuestions[i].flagState)) {
            //unattempted-color
            document.getElementById(randomQuestions[i].number).style.backgroundColor = "#ec5858";
        }
        showQuestion(currentQuestion, randomQuestions);
    })

    if(randomQuestions[i].flagState) {
        document.getElementById('flag').textContent = 'Unmark for review';
    }else {
        document.getElementById('flag').textContent = 'Mark for review';
    }

    for(let x=1; x<randomQuestions[i].number; x++) {
        for(let y=0; y<randomQuestions.length; y++) {
            if(randomQuestions[y].number == x) {
                if(!randomQuestions[y].marked && !randomQuestions[y].flagState) {
                    document.getElementById(randomQuestions[y].number).style.backgroundColor = '#ec5858';
                }
            }
        }
            
    }

    if(document.getElementById('yesButton') != null) {
        document.getElementById('yesButton').style.display = 'none';
        document.getElementById('noButton').style.display = 'none';
        document.getElementById('confMsg').style.display = 'none';
    }

}


function scoreAnswer(current) {

    var e = event.target.nextElementSibling;

    if(e.matches("input") || e.matches("label")){

        if(current.answer.length>0) {

            if(!current.multiAnswer) {

                if((e.textContent.slice(4) == selectedItems[0]) || (e.textContent.slice(4) == current.userAnswer[0])) {

                    selectedItems = [];
                    current.userAnswer = [];
                    current.marked = false;

                } else {

                    selectedItems[0] = e.textContent.slice(4);
                    current.userAnswer[0] = e.textContent.slice(4);

                }

            } else {
                let ticked = false;
                for(let y=0; y<selectedItems.length; y++) {
                    if(e.textContent.slice(4) == selectedItems[x]) {
                        ticked = true;
                        current.userAnswer.splice(indexOf(selectedItems[y]), 1);
                        selectedItems.splice(y, 1);
                    }
                }

                let chosen = false;
                for(let x=0; x<current.userAnswer.length; x++) {
                    if(e.textContent.slice(4) == current.userAnswer[x]) {
                        chosen = true;
                        current.userAnswer.splice(x, 1);
                    }
                }

                if(!ticked && !chosen) {
                    selectedItems.push(e.textContent.slice(4));
                    current.userAnswer.push(e.textContent.slice(4));
                }
            }                

        } else {

            selectedItems[0] = e.textContent.slice(4);
            current.userAnswer[0] = e.textContent.slice(4);

        }
        //to here

        if(!current.multiAnswer){
            let selectedId = event.target.id;
            for(x=0; x<current.choices.length; x++) {
                if(!(('checkBox-' + x) == selectedId)) {
                    document.querySelector('#checkBox-' + x).checked = false;
                }
            } 
        }

        //added scoring code from here
        if(!current.multiAnswer) {

            if(current.userAnswer[0] == current.answer[0]) {
                score++;
                current.correct = true;
            } else {

                if(current.correct) {
                    score--;
                }

                current.correct = false;
            }

        } else if(current.multiAnswer) {

            if(current.answer.length == current.userAnswer.length) {

                let equal = true;
                let sort1 = current.answer.sort();
                let sort2 = current.userAnswer.sort();
                for(let x=0; x<current.answer.length; x++) {
                    if(!(sort1[x] == sort2[x])) {
                        equal = false;
                    }
                } 

                if(equal) {
                    score++;
                    current.correct = true;
                } else {

                    if(current.correct) {
                        score--;
                    }
                    
                    current.correct = false;
                }

            } else {

                if(current.correct) {
                    score--;
                }

                current.correct = false;
            }

        }

        if((current.userAnswer.length>0) && !(current.marked)) {
            current.marked = true;
            if(!(current.flagState)) {
                attempted++;
            }
            
        } else if(current.userAnswer.length==0) {
            if(!(current.flagState)) {
                attempted--;
                current.marked = false;
            }
                
        }

        document.getElementById('flagged').textContent = flagged;
        document.getElementById('attempted').textContent = attempted;
        document.getElementById('unattempted').textContent = questions.length - attempted - flagged;

        if(!current.flagState) {
            if(!current.marked) {
                //initial question panel color
                document.getElementById(current.number).style.backgroundColor = "#e0e6e0";
                document.getElementById(current.number).style.color = "black";    
            } else if(current.marked) {
                document.getElementById(current.number).style.backgroundColor = "#088a85";
                document.getElementById(current.number).style.color = "white";
            }
        }
 
        showAnswer(current, selectedItems);
    }
}

function showAnswer(current, selectedItems) {
    for(let i = 0; i < current.choices.length; i++){
        
        let questionid = "#questionNum-" + i;
        let questionrow = document.querySelector(questionid);
        if(selectedItems.length>0) {
            let absent = true;
            for(x=selectedItems.length-1; x>=0; x--) {
                
                if(!current.multiAnswer){
                    if(selectedItems[0] == current.choices[i]){
                        //questionrow.setAttribute("style", "background-color: #088a85; color: white");
                    } else {
                        //questionrow.setAttribute("style", "background-color: white;");
                    }              
                }else {
                    if(selectedItems[x] == current.choices[i]){
                        //questionrow.setAttribute("style", "background-color: #088a85; color: white");
                        absent = false;
                    } 
                }
            }
            if(absent && current.multiAnswer) {
                //questionrow.setAttribute("style", "background-color: white;");
            }
        } else {
            //questionrow.setAttribute("style", "background-color: white;");
        }
                
    }        
}

function refresh() {
    location.reload();
}

function endTest() {

    stopTimer();
    clear();

    document.getElementById('reviewBoxContainer').style.display = 'none';
    document.getElementById('watermark').style.display = 'none';

    document.getElementById('questionBox').style.display = 'block';
    document.getElementById('questionBox').style.textAlign = 'center';

    //document.getElementById('logo').style.left = "41%";
    document.getElementById('questionBox').style.left = "48%";
    document.getElementById('questionBox').style.top = "25%";
    document.getElementById('questionBox').style.width = "30%";


    document.getElementById('attemptedIcon').style.visibility = "hidden";
    document.getElementById('unattemptedIcon').style.visibility = "hidden";
    document.getElementById('flaggedIcon').style.visibility = "hidden";
    
    timerTable.style.visibility = "hidden";
    document.getElementById('status').style.visibility = "hidden";
    var sidebar = document.getElementById("sidebar");
    sidebar.style.display = "none";

    var tickIcon = document.createElement('div');
    tickIcon.setAttribute('id', 'tickCircle');
    tickIcon.innerHTML += "<span id='whiteTick'>&#x2713;</span>" 

    let heading = document.createElement("p");
    heading.setAttribute("id", "heading");
    heading.setAttribute("class", "scorePagedetails");
    heading.textContent = "Congratulations! You have completed the test.";

    let instructions = document.createElement("p");
    instructions.setAttribute("id", "scoreMsg");
    instructions.setAttribute("class", "scorePagedetails");
    // instructions.textContent = "Hey! " + testId + " Your Score is " + Math.round((score/questions.length)*100) + "%";
    instructions.innerHTML = "Your Score is   <span id='scorePercent'>" + Math.round((score/questions.length)*100) + "%</span> (" + score + " Points)";
 
    var attNo = document.getElementById('attempted').textContent;
    var unattNo = document.getElementById('unattempted').textContent;
    var flgNo = document.getElementById('flagged').textContent;
    var scorePercent = Math.round((score/questions.length)*100);

    //adding test info to database
    var xhttp = new XMLHttpRequest();
    // xhttp.open("POST", `https://onlinetestapplication.herokuapp.com/students/data/${testId}/${attNo}/${unattNo}/${flgNo}/${scorePercent}`, true);
    xhttp.open("POST", `https://localhost:3000/students/data/${testId}/${attNo}/${unattNo}/${flgNo}/${scorePercent}`, true);
    //xhttp.open("POST", "https://onlinetestapplication.herokuapp.com/students/data", true);
    //xhttp.open("POST", "http://localhost:3000/students/data", true);
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        
        var response = this.responseText;
    }
    };
    //xhttp.send();
    var data = {'testId':`${testId}`, 'attNo': `${attNo}`,'unattNo': `${unattNo}`, 'flgNo':`${flgNo}`, 'scorePercent':`${scorePercent}`};
    xhttp.send(JSON.stringify(data));

    var review = document.createElement('button');
    review.setAttribute('id', 'reviewBtn');
    review.setAttribute('onclick', 'showReview()');
    review.textContent = 'Review the test';

    var attStatus = document.createElement('p');
    attStatus.setAttribute("id", 'attemptedStatus');
    attStatus.setAttribute("class", "scorePagedetails");
    attStatus.textContent = 'ATTEMPTED: ' + document.getElementById('attempted').textContent;

    var unattStatus = document.createElement('p');
    unattStatus.textContent = 'UNATTEMPTED: ' + document.getElementById('unattempted').textContent;

    var flaggedStatus = document.createElement('p');
    flaggedStatus.textContent = 'MARKED FOR REVIEW: ' + document.getElementById('flagged').textContent;

    quiz.appendChild(tickIcon);
    quiz.appendChild(heading);

    quiz.appendChild(instructions);
    quiz.appendChild(attStatus);
    // quiz.appendChild(unattStatus);
    // quiz.appendChild(flaggedStatus);

    quiz.appendChild(review);

    document.getElementById('noButton').style.display = 'none';
    document.getElementById('yesButton').style.display = 'none';
    document.getElementById('confMsg').style.display = 'none';
}

function continueTest() {

    //document.getElementById('logo').style.left = "32%";
    document.getElementById('questionBox').style.left = "550px";

    document.getElementById('sidebar').style.visibility = 'visible';
    document.getElementById('timer').style.visibility = 'visible';
    document.getElementById('status').style.visibility = 'visible';
    document.getElementById('attemptedIcon').style.visibility = "visible";
    document.getElementById('unattemptedIcon').style.visibility = "visible";
    document.getElementById('flaggedIcon').style.visibility = "visible";

    document.getElementById('questionBox').style.top = "16%";

    document.getElementById('questionBox').style.width = "700px";
    showQuestion(currentQuestion-1, randomQuestions);
}

function endQuiz(){

    //document.getElementById('logo').style.left = "41%";

    document.getElementById('questionBox').style.width = "50%";
    document.getElementById('questionBox').style.left = "50%";

    document.getElementById('sidebar').style.visibility = 'hidden';
    document.getElementById('timer').style.visibility = 'hidden';
    document.getElementById('status').style.visibility = 'hidden';
    document.getElementById('attemptedIcon').style.visibility = "hidden";
    document.getElementById('unattemptedIcon').style.visibility = "hidden";
    document.getElementById('flaggedIcon').style.visibility = "hidden";

    document.getElementById('watermark').style.display = 'none';

    if(!((quizDuration - quizSecondElapsed) < 1)) {

        document.getElementById('hr').style.display = 'none';

        document.getElementById('questionBox').style.top = '200px';

        let confirmationMessage = document.createElement('h2');
        confirmationMessage.setAttribute("id", "confMsg");
        confirmationMessage.innerText = 'Are you sure you want to submit?'
        document.getElementById('questionBox').appendChild(confirmationMessage);

        let inputOne = document.createElement('INPUT');
        inputOne.setAttribute("type", "button");
        inputOne.setAttribute("value", "Yes");
        inputOne.setAttribute("id", "yesButton");
        inputOne.setAttribute("class", "confButton");
        inputOne.setAttribute("onclick", "endTest()");
        document.getElementById('questionBox').appendChild(inputOne);

        let inputTwo = document.createElement('INPUT');
        inputTwo.setAttribute("type", "button");
        inputTwo.setAttribute("value", "No");
        inputTwo.setAttribute("class", "confButton");
        inputTwo.setAttribute("onclick", "continueTest()");
        inputTwo.setAttribute("id", "noButton");
        document.getElementById('questionBox').appendChild(inputTwo);

        document.getElementById('yesButton').style.display = 'inline-block';
        document.getElementById('noButton').style.display = 'inline-block';
        document.getElementById('confMsg').style.display = 'block';

    } else {

        endTest();
        
    }
}

function showReview() {

    document.getElementById('reviewBoxContainer').style.display = 'block';

    //just added
    document.getElementById('reviewBoxContainer').textContent = '';

    var heading = document.createElement('h1');
    heading.setAttribute('id', 'testReview')
    heading.textContent = 'Test Review';

    var cuteLittleLine = document.createElement('hr');
    
    document.getElementById('reviewBoxContainer').appendChild(heading);
    document.getElementById('reviewBoxContainer').appendChild(cuteLittleLine);

    var revBoxContent = document.createElement('div');
    revBoxContent.setAttribute('id', 'reviewBoxContent');
    document.getElementById('reviewBoxContainer').appendChild(revBoxContent);

    revBoxContent.textContent = '';

    document.getElementById('questionBox').style.display = 'none';


    var questionNumbers = [];

    let passedAll = true;
    for(let x=0; x<questions.length; x++) {
            
        questionNumbers.push(parseInt(questions[x].number));
 
    }

    questionNumbers.sort(function(a, b){return a-b});

    var reviewQuestions = [];

    for(let y=0; y<questionNumbers.length; y++) {
        for(let x=0; x<questions.length; x++) {
            if(questionNumbers[y] == questions[x].number) {

                var correctAnswer = document.createElement('p');
                correctAnswer.textContent = questions[x].answer;

                var yourAnswer = document.createElement('p');
                yourAnswer.textContent = questions[x].userAnswer;
                
                let choiceLabel, yourAnswerLabel;
                for(let k=0; k<questions[x].choices.length; k++) {
                    if(correctAnswer.textContent == questions[x].choices[k]) {
                        
                        if(k==0) {
                            choiceLabel = 'a. ';
                        }else if(k==1) {
                            choiceLabel = 'b. ';
                        } else if(k==2) {
                            choiceLabel = 'c. ';
                        } else {
                            choiceLabel = 'd. ';
                        }
                        
                    }
                }

                for(let k=0; k<questions[x].choices.length; k++) {
                    if(yourAnswer.textContent == questions[x].choices[k]) {
                        
                        if(k==0) {
                            yourAnswerLabel = 'a. ';
                        }else if(k==1) {
                            yourAnswerLabel = 'b. ';
                        } else if(k==2) {
                            yourAnswerLabel = 'c. ';
                        } else {
                            yourAnswerLabel = 'd. ';
                        }
                        
                    }
                }

                yourAnswer.textContent = yourAnswerLabel + questions[x].userAnswer;
                correctAnswer.textContent = choiceLabel + questions[x].answer;

                var questionStatement = document.createElement('h3');
                questionStatement.textContent = questions[x].number + ') ' + questions[x].question;

                var explannation = document.createElement('p');
                explannation.textContent = questions[x].explannation;

                reviewQuestions.push({"qn": questionStatement.textContent, "urAnswer": yourAnswer.textContent, "crctAnswer": correctAnswer.textContent, "explannation": explannation.textContent});

                break;
            }
        }
    }

    let lastNumber, firstNumber;

    firstNumber=1;
    lastNumber=10;

    for(let x=0; x<((lastNumber>reviewQuestions.length)?reviewQuestions.length:10); x++) {

        var questionStatement = document.createElement('h3');
        questionStatement.setAttribute('class', 'questionStatement');
        var correctAnswer = document.createElement('p');
        correctAnswer.setAttribute('class', 'correctAnswer');
        var yourAnswer = document.createElement('p');
        yourAnswer.setAttribute('class', 'yourAnswer');

        var explannation = document.createElement('p');
        explannation.innerHTML = "<i class='far fa-lightbulb'></i>"
        explannation.setAttribute('class', 'explannation');

        questionStatement.textContent = reviewQuestions[x].qn;
        yourAnswer.textContent = reviewQuestions[x].urAnswer;
        correctAnswer.textContent = reviewQuestions[x].crctAnswer;
        explannation.innerHTML += reviewQuestions[x].explannation;

        document.getElementById('reviewBoxContent').appendChild(questionStatement);

        for(let y=0; y<questions.length; y++) {
            if(questions[y].question == questionStatement.textContent.substr(questionStatement.textContent.indexOf(' ')+1)) {

                if(questions[y].number+')' == questionStatement.textContent.split(' ')[0]) {

                    if(!(questions[y].correct) && (yourAnswer.textContent != 'undefined')){
                        document.getElementById('reviewBoxContent').appendChild(yourAnswer);
                    }

                }

            }
        }

        document.getElementById('reviewBoxContent').appendChild(correctAnswer);

        document.getElementById('reviewBoxContent').appendChild(explannation);

    }

    // firstNumber=1;
    // lastNumber=10;

    var prevPage = document.createElement('button');
    prevPage.textContent = 'Previous';
    prevPage.setAttribute('id', 'prevPage');

    var nextPage = document.createElement('button');
    nextPage.textContent = 'Next';
    nextPage.setAttribute('id', 'nextPage');

    
    if(reviewQuestions.length<=10) {
        nextPage.style.display = "none";
    }

    var scorePageBtn = document.createElement('button');
    scorePageBtn.textContent = 'View score';
    scorePageBtn.setAttribute('id', 'scorePageBtn');
    scorePageBtn.addEventListener('click', endTest);

    //document.getElementById('headerPanel').appendChild(scorePageBtn);

    nextPage.addEventListener('click', function nextFunction() {

        document.getElementById('reviewBoxContent').textContent = '';

        firstNumber = firstNumber + 10;
        lastNumber = lastNumber + 10;

        for(let x=0; x<((lastNumber>reviewQuestions.length)?(reviewQuestions.length%10):10); x++) {
            var questionStatement = document.createElement('h3');
            questionStatement.setAttribute('class', 'questionStatement');
            var correctAnswer = document.createElement('p');
            correctAnswer.setAttribute('class', 'correctAnswer');
            var yourAnswer = document.createElement('p');
            yourAnswer.setAttribute('class', 'yourAnswer');

            var explannation = document.createElement('p');
            explannation.innerHTML = "<i class='far fa-lightbulb'></i>"
            explannation.setAttribute('class', 'explannation');

            questionStatement.textContent = reviewQuestions[(lastNumber - 10) + x].qn;
            yourAnswer.textContent = reviewQuestions[(lastNumber - 10) + x].urAnswer;
            correctAnswer.textContent = reviewQuestions[(lastNumber - 10) + x].crctAnswer;

            explannation.textContent += reviewQuestions[(lastNumber - 10) + x].explannation;

            document.getElementById('reviewBoxContent').appendChild(questionStatement);

            for(let y=0; y<questions.length; y++) {
            if(questions[y].question == questionStatement.textContent.substr(questionStatement.textContent.indexOf(' ')+1)) {

                if(questions[y].number+')' == questionStatement.textContent.split(' ')[0]) {

                    if(!(questions[y].correct) && (yourAnswer.textContent != 'undefined')){
                        document.getElementById('reviewBoxContent').appendChild(yourAnswer);
                    }

                }

            }
        }

            document.getElementById('reviewBoxContent').appendChild(correctAnswer);

            document.getElementById('reviewBoxContent').appendChild(explannation);

        }

        if(lastNumber >= questions.length) {
            nextPage.style.display = 'none';

            scorePageBtn.style.display = 'inline-block';

        } else if(lastNumber < questions.length) {
            nextPage.style.visibility = 'visible';
            nextPage.textContent = 'Next';
        }

        prevPage.style.visibility = 'visible';

    });

    prevPage.addEventListener('click', function() {
            
        document.getElementById('reviewBoxContent').textContent = '';

        for(let x=0; x<10; x++) {
            var questionStatement = document.createElement('h3');
            questionStatement.setAttribute('class', 'questionStatement');
            var correctAnswer = document.createElement('p');
            correctAnswer.setAttribute('class', 'correctAnswer');
            var yourAnswer = document.createElement('p');
            yourAnswer.setAttribute('class', 'yourAnswer');

            var explannation = document.createElement('p');
            explannation.innerHTML = "<i class='far fa-lightbulb'></i>"
            explannation.setAttribute('class', 'explannation');

            questionStatement.textContent = reviewQuestions[(firstNumber-11) + x].qn;
            yourAnswer.textContent = reviewQuestions[(firstNumber-11) + x].urAnswer;
            correctAnswer.textContent = reviewQuestions[(firstNumber-11) + x].crctAnswer;

            explannation.textContent += reviewQuestions[(firstNumber-11) + x].explannation;

            document.getElementById('reviewBoxContent').appendChild(questionStatement);

            for(let y=0; y<questions.length; y++) {
                if(questions[y].question == questionStatement.textContent.substr(questionStatement.textContent.indexOf(' ')+1)) {
    
                    if(questions[y].number+')' == questionStatement.textContent.split(' ')[0]) {
    
                        if(!(questions[y].correct) && (yourAnswer.textContent != 'undefined')){
                            document.getElementById('reviewBoxContent').appendChild(yourAnswer);
                        }
    
                    }
    
                }
            }

            document.getElementById('reviewBoxContent').appendChild(correctAnswer);

            document.getElementById('reviewBoxContent').appendChild(explannation);

        }
        
        firstNumber = firstNumber - 10;
        lastNumber = lastNumber - 10;

        if(firstNumber == 1) {
            prevPage.style.visibility = 'hidden';
        } else {
            prevPage.style.visibility = 'visible';
        }

        //scorePageBtn.style.display = 'none';

        nextPage.style.display = 'inline-block';
        nextPage.style.visibility = 'visible';
        nextPage.textContent = 'Next';
        
    });

    document.getElementById('reviewBoxContainer').appendChild(prevPage);
    document.getElementById('reviewBoxContainer').appendChild(nextPage);
    document.getElementById('reviewBoxContainer').appendChild(scorePageBtn);

}

function stopTimer() {
    quizSeconds = 0;
    clearInterval(quizInterval);
}

init();