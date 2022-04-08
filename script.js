const initCardImages = [
	'discord',
	'facebook',
	'instagram',
	'pinterest',
	'reddit',
	'tiktok',
	'twitch',
	'twitter',
	'whatsapp',
	'youtube'
];

const cardImages = initCardImages.map(function (item) {
	return [item, item];
}).reduce(function (a, b) { 
	return a.concat(b);
});

const table = document.querySelector('.card-table');
const limit = 2;
let stars = document.querySelectorAll('.stars li');
let gameCardsQTY = cardImages.length / 2;
let threeStar = gameCardsQTY + 13;
let twoStar = gameCardsQTY + 17;
let oneStar = gameCardsQTY + 21;
let template = '';
let time;
let rating = 3;
let minutes = 0;
let seconds = 0;
let opened = [];
let match = 0;
let moves = 0;

function timer() {
	const timeCounter = document.querySelector(".timer");
	time = setInterval(function () {
		seconds++;
		if (seconds === 60) {
			minutes++;
			seconds = 0;
		}
		timeCounter.innerHTML = minutes + " Mins " + seconds + " Secs";
		if (minutes === limit) {
			endGame(moves, 0);
			document.querySelector('.result .message').innerHTML = "Time's up! You lose!";
		}
	}, 1000);
}

document.querySelector('.reset').addEventListener('click', function (e) {
	e.preventDefault();
	clearInterval(time);
	startGame();
});

for (const play of document.querySelectorAll('.play')) {
	playEvent(play);
}

function playEvent (el) {
	el.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector('.result').style.display = 'none';
		document.querySelector('.landing').style.display = 'none';
		document.querySelector('.game').style.display = 'block';
		startGame();
	});
}

function startGame() {

	table.innerHTML = '';
	match = 0;
	moves = 0;
	template = '';
	time = '';
	minutes = 0;
	seconds = 0;
	timer();
	
	setTimeout(function () {
		var cards = cardImages.sort(function () {
			return Math.random() - 0.5;
		});

		document.querySelector('.moves').innerHTML = moves;

		for (const star of stars) {
			star.classList.add('colored');
		}

		for (var i = 0; i < cards.length; i++) {
			template += '<li class="card"><img src="media/card-icons/' + cards[i] + '.png"></i></li>';
		}
		table.innerHTML = template;

		const upsideDownCards = document.querySelectorAll(".card:not(.match):not(.open)");
		for (let i = 0; i < upsideDownCards.length; i++) {
			cardFlip(upsideDownCards[i]);
		}

	}, 100);
}

function ratePlay(moves) {
	let coloredStars = document.querySelectorAll('.stars li.colored').length;
	let cnt = coloredStars;
	if (coloredStars > 1) {
		cnt = coloredStars -1;
	}

	if (moves < threeStar) {
		rating = 3;
	} else if (moves < twoStar) {
		rating = 2;
	} else {
		rating = 1;
	}
	console.log(threeStar, twoStar, oneStar, moves);
	if (coloredStars > rating) {
		stars[cnt].classList.remove('colored');
	}

	return { score: rating };
}

function endGame(moves, score) {
	const finalTime = document.querySelector('.timer').textContent;
	document.querySelector('.result').style.display = 'block';
	document.querySelector('.game').style.display = 'none';
	document.querySelector('.moves-data').innerHTML = moves;
	document.querySelector('.score-data').innerHTML = score;
	document.querySelector('.result .time-data').innerHTML = finalTime;
	clearInterval(time);
}

function cardFlip(card) {
	card.addEventListener('click', function () {

		if (card.classList.contains('open') || card.classList.contains('match')) {
			return true;
		}

		opened.push(card);
		card.classList.add('open', 'show');
		const openedCards = document.querySelectorAll('.card-table .open');

		if (opened.length > 1) {
			if (card.innerHTML === opened[0].innerHTML) {
				for (const openCard of openedCards) {
					openCard.classList.add('match', 'animated', 'infinite', 'rubberBand');
					const matchedCards = document.querySelectorAll('.card-table .match');
					setTimeout(function () {
						for (const matchedCard of matchedCards) {
							matchedCard.classList.remove('open', 'show', 'animated', 'infinite', 'rubberBand');
							matchedCard.style.outline = '0';
						}
					}, 800);
				}
				match++;
			} else {
				for (const openCard of openedCards) {
					openCard.classList.add('notmatch', 'animated', 'infinite', 'wobble');
					setTimeout(function () {
						openCard.classList.remove('animated', 'infinite', 'wobble');
					}, 800 / 1.5);
					setTimeout(function () {
						openCard.classList.remove('open', 'show', 'notmatch', 'animated', 'infinite', 'wobble');
					}, 800);
				}
			}
			opened = [];
			moves++;
			ratePlay(moves);
			document.querySelector('.moves').innerHTML = moves;
		}

		if (gameCardsQTY === match) {
			ratePlay(moves);
			var score = ratePlay(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 1000);
		}
	});
}
