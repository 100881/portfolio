const quizData = [
    { question: "Wat is dit voor zeedier?", image: "./img/zeester.jpg", choices: ["Koraal", "Zeester", "Krab", "Spons"], correct: 1 },
    { question: "Welke vis is dit?", image: "./img/zeepaard.jpg", choices: ["Haaienvis", "Kogelvis", "Kabeljauw", "Zeepaardje"], correct: 3 },
    { question: "Wat is het grootste zeedier?", image: "./img/blauwevinvis.jpg", choices: ["Walvishaai", "Blauwe vinvis", "Orka", "Reuzeninktvis"], correct: 1 },
    { question: "Welke kleur heeft het bloed van een octopus?", image: "./img/octopus.jpg", choices: ["Rood", "Blauw", "Groen", "Geel"], correct: 1 },
    { question: "Wat is de functie van koraalriffen?", image: "./img/koraal.jpg", choices: ["Zuurstof produceren", "Golfbrekers", "Voedselbron", "Alle bovenstaande"], correct: 3 },
    { question: "Hoe ademen vissen onder water?", image: "./img/kieuw.jpg", choices: ["Longen", "Huid", "Kieuwen", "Snavel"], correct: 2 },
    { question: "Wat is bioluminescentie?", image: "./img/lichtvis.jpg", choices: ["Licht geven", "Giftigheid", "Elektrische schokken", "Onzichtbaarheid"], correct: 0 },
    { question: "Wat eet een zeeschildpad?", image: "./img/zeeschildpad.jpg", choices: ["Kwallen", "Zeewier", "Vissen", "Koraal"], correct: 0 },
    { question: "Wat is de dodelijkste kwal ter wereld?", image: "./img/dooskwal.jpg", choices: ["Portugees Oorlogsschip", "Dooskwal", "Zeewesp", "Blauwe draak"], correct: 2 },
    { question: "Welke haai is het gevaarlijkst voor mensen?", image: "./img/stierhaai.jpg", choices: ["Witte haai", "Stierhaai", "Tijgerhaai", "Walvishaai"], correct: 1 },
    { question: "Hoeveel armen heeft een octopus?", image: "./img/octopus2.jpg", choices: ["6", "8", "10", "12"], correct: 1 },
    { question: "Welke vis kan op het land overleven?", image: "./img/longvis.jpg", choices: ["Klimbaarvis", "Longvis", "Slangkopvis", "Alle bovenstaande"], correct: 3 },
    { question: "Wat is de snelste vis ter wereld?", image: "./img/zeilvis.jpg", choices: ["Zwaardvis", "Tonijn", "Zeilvis", "Barracuda"], correct: 2 },
    { question: "Welke oceaan is de diepste?", image: "./img/oceaan.jpg", choices: ["Atlantische", "Indische", "Arctische", "Stille"], correct: 3 },
    { question: "Hoeveel procent van de oceaan is nog onontdekt?", image: "./img/mysteryocean.jpg", choices: ["10%", "50%", "80%", "95%"], correct: 3 },
    { question: "Hoe noemen we een groep vissen?", image: "./img/schoolvis.jpg", choices: ["Zwerm", "Troep", "School", "Kudde"], correct: 2 },
    { question: "Wat is het grootste roofdier in de oceaan?", image: "./img/orka.jpg", choices: ["Orka", "Witte haai", "Reuzenkabeljauw", "Zwaardvis"], correct: 0 },
    { question: "Wat is het kleinste zeedier?", image: "./img/pygmee.jpg", choices: ["Pygmeezeepaardje", "Mini-inktvis", "Dwerggarnaal", "Microkrab"], correct: 0 },
    { question: "Wat is het verschil tussen een dolfijn en een bruinvis?", image: "./img/dolfijn.jpg", choices: ["Grootte", "Vorm van de snuit", "Aantal tanden", "Alle bovenstaande"], correct: 3 },
    { question: "Welke haai kan in zoet water overleven?", image: "./img/zoethaai.jpg", choices: ["Stierhaai", "Tijgerhaai", "Witte haai", "Zebrahaai"], correct: 0 },
    { question: "Wat is een mantarog?", image: "./img/mantarog.jpg", choices: ["Een vis", "Een zoogdier", "Een schaaldier", "Een reptiel"], correct: 0 },
    { question: "Hoe noemen we de diepste plek in de oceaan?", image: "./img/marianentrog.jpg", choices: ["Marianentrog", "Java-trog", "Puerto Rico-trog", "Kermadec-trog"], correct: 0 },
    { question: "Welke zeeslak is giftig en heeft felle kleuren?", image: "./img/zeeslak.jpg", choices: ["Zee-engel", "Blauwe draak", "Zeenaaktslak", "Kroonnaaktslak"], correct: 1 },
    { question: "Hoe noemen we het fenomeen waarbij vissen licht geven?", image: "./img/lichtvis2.jpg", choices: ["Fluorescentie", "Fosforescentie", "Bioluminescentie", "Radiatie"], correct: 2 },
    { question: "Wat doet een zeekomkommer als hij zich bedreigd voelt?", image: "./img/zeekomkommer.jpg", choices: ["Schiet organen uit", "Verandert van kleur", "Wordt onzichtbaar", "Maakt geluid"], correct: 0 },
    { question: "Welke kleur licht verdwijnt het eerst onder water?", image: "./img/kleurwater.jpg", choices: ["Rood", "Groen", "Blauw", "Geel"], correct: 0 },
    { question: "Wat voor soort dier is een zee-egel?", image: "./img/zeeegel.jpg", choices: ["Weekdier", "Schaaldier", "Stekelhuidige", "Zoogdier"], correct: 2 },
    { question: "Wat is het grootste koraalrif ter wereld?", image: "./img/reef.jpg", choices: ["Great Barrier Reef", "Belize Barrier Reef", "Raja Ampat", "Red Sea Coral Reef"], correct: 0 },
    { question: "Welke oceaan heeft de meeste haaien?", image: "./img/haaienpopulatie.jpg", choices: ["Atlantische", "Indische", "Stille", "Zuidelijke"], correct: 2 },
    { question: "Wat is de meest intelligente inktvis?", image: "./img/mimicoctopus.jpg", choices: ["Reuzeninktvis", "Mimic octopus", "Blauwring octopus", "Gewone octopus"], correct: 1 }
];


let currentQuestionIndex = 0;
let score = 0;
let timer;
const questionElement = document.getElementById("question");
const imageElement = document.getElementById("question-image");
const choicesContainer = document.getElementById("choices");
const feedbackElement = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const currentQuestionText = document.getElementById("current-question");
const timerElement = document.getElementById("time-left");
const scoreElement = document.getElementById("score");

function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        endQuiz();
        return;
    }
    
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    imageElement.src = currentQuestion.image;
    choicesContainer.innerHTML = "";
    feedbackElement.textContent = "";

    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("choice-button");
        button.onclick = () => checkAnswer(index);
        choicesContainer.appendChild(button);
    });

    progressBar.value = currentQuestionIndex + 1;
    currentQuestionText.textContent = currentQuestionIndex + 1;
    startTimer();
}

function startTimer() {
    let timeLeft = 20;
    timerElement.textContent = timeLeft;

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            showCorrectAnswer();
        }
    }, 1000);
}

function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const currentQuestion = quizData[currentQuestionIndex];

    if (selectedIndex === currentQuestion.correct) {
        score += 10;
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = `Fout! Het juiste antwoord is: ${currentQuestion.choices[currentQuestion.correct]}`;
        feedbackElement.style.color = "red";
    }

    scoreElement.textContent = `Score: ${score}`;

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

function showCorrectAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    feedbackElement.textContent = `Tijd is om! Het juiste antwoord is: ${currentQuestion.choices[currentQuestion.correct]}`;
    feedbackElement.style.color = "orange";

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

function endQuiz() {
    questionElement.textContent = "Quiz voltooid!";
    imageElement.style.display = "none";
    choicesContainer.innerHTML = "";
    feedbackElement.textContent = `Je eindscore is: ${score}`;
    timerElement.style.display = "none";
}


// Start de quiz
loadQuestion();
