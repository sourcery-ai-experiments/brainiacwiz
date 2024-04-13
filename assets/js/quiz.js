import { questions, topics } from './utils/questions.js';

if (!questions || !questions.techAnswers || !questions.techQuestions) {
	throw new Error('Questions data is not properly imported or is missing.');
}

const quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
const quizTimer = document.querySelector('.quiz-timer > #timer');
const quizQuestion = document.querySelector('.quiz-question #question');
const gamePin = new URLSearchParams(window.location.search).get('gamePin');
const topic = new URLSearchParams(window.location.search).get('topic');

const setQuestions = (question) => {
	questions.techAnswers[question] = questions.techAnswers[question].sort(
		() => Math.random() - 0.5,
	);

	quizQuestion.innerHTML = questions.techQuestions[question];

	quizOptBtns.forEach((btn, index) => {
		btn.innerHTML = questions.techAnswers[question][index];
	});

	setQuizBtns();
};

const colors = [
	'var(--prim-color)',
	'var(--sec-color)',
	'var(--tert-color)',
	'var(--quart-color)',
];

function setQuizBtns() {
	const chosen = [];
	quizOptBtns.forEach((btn, index) => {
		while (true) {
			const ran = Math.floor(Math.random() * colors.length);
			if (!chosen.includes(ran)) {
				btn.style.backgroundColor = colors[ran];
				btn.style.boxShadow = `4px 4px 4px 0  ${colors[ran - 1]}`;
				chosen.push(ran);
				break;
			}
		}
	});

	quizOptBtns.forEach((btn, index) => {
		let prevStyle = btn.style.backgroundColor;
		btn.addEventListener('mouseover', () => {
			btn.style.backgroundColor = 'rgb(73, 165, 165)';
		});
		btn.addEventListener('mouseout', () => {
			btn.style.backgroundColor = prevStyle;
		});
	});
}

setQuizBtns();
setQuestions(0);

const setQuizTImer = ({ duration = 30, speed = 200 }) => {
	quizTimer.style.color = 'white';
	let time = duration;
	let question = 0;

	let intervalId = setInterval(() => {
		if (time <= 0) {
			if (question >= questions.techQuestions.length - 1) {
				moveToPostQuiz(intervalId);
			}

			question++;
			setQuestions(question);
			time = duration;
		}

		time--;
		let min = Math.floor(time / 60);
		let sec = time % 60;
		quizTimer.innerHTML = `${min}:${sec}`;

		// change the with of the timer with respect to the time
		quizTimer.style.width = `${(time / duration) * 100}%`;
	}, speed);
};

setQuizTImer({ duration: 30, speed: 200 });

function moveToPostQuiz(intervalId) {
	clearInterval(intervalId); // stop the interval
	window.location.href = `./post-quiz.html?gamePin=${gamePin}&topic=${topic}`;
}
