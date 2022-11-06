//Variables generales
const form = $("#form");
const startButton = $("#startButton");
const resetButton = $("#resetButton");
const formInputs = $(".input-container");
const numberOfPlayers = $("#numberOfPlayers")[0];
const scoreFinal = $("#winningScore")[0]; 
const raceLines = $("#raceLines")[0];
const raceSection = $("#race");
const scoresTable = $("#scores");
const scoresBody = $("#scoresBody")[0];
const toggleRaceButton = $("#toggleRaceButton");
let toggleToStart = true;
let toggleToRace = true;
let players = [];
let winner;

//Añadir event listeners
form.on("submit", function (e) {
	e.preventDefault();
    raceStart();
});
form.on("reset", function (e) {
	e.preventDefault();
    raceReset();
});
toggleRaceButton.on("click", function () {
	changeToggleToRace();
});

//Toggle de iniciar o resetear
const toggleForm = () => {
	if(toggleToStart) {
		startButton.hide();
		resetButton.show();
		raceSection.show();
		formInputs.hide();
	} else {
		//reset array y li de líneas
		players = [];
		winner = undefined;
		resetButton.hide();
		startButton.show();
		formInputs.show();
		raceSection.hide();
	}
	toggleToStart = !toggleToStart;
}

//Crear líneas de competición
const createRace = () => {
	for (let i = 1; i <= Number(numberOfPlayers.value); i++){
		let player = {img: `./img/car${i}.png`, position: i, score: 0}
		let li = document.createElement("li");
		let img = document.createElement("img");

		img.setAttribute("id",i);
		img.alt=`coche número ${i}`;
		img.src=player.img;

		players.push(player);
		li.appendChild(img);
		raceLines.appendChild(li);
	};
}

//Movimiento de los coches
const moveCars = () => {
	players.forEach((player, index) => {
		const movement = Math.floor(Math.random() * 10) + 1;
		const totalPosition = players[index].score + movement;
		players[index].score = totalPosition; 
		$(`#${++index}`).animate({marginLeft: totalPosition});
		if (!winner && totalPosition >= scoreFinal.value) {
			winner = true;
		}
	});

	if (!winner) {
		setTimeout(moveCars, 1000);
	} else {
		scoresTable.show();
		raceSection.hide();
		toggleRaceButton.show();
		createScoreTable();
	}
}

//Crear tablas con puntuaciones
const createScoreTable = () => {
	const sortedPlayer = players.sort((a, b) => (a.score > b.score) ? -1 : 1);
	sortedPlayer.forEach((sortedPlayer, index) => {
		let tr = document.createElement("tr");
		let position = document.createElement("td");
		let player = document.createElement("td");
		let score = document.createElement("td");

		position.innerHTML = ++index;
		player.innerHTML = sortedPlayer.position;
		score.innerHTML = sortedPlayer.score;

		tr.appendChild(position);
		tr.appendChild(player);
		tr.appendChild(score);
		scoresBody.appendChild(tr);
	});

}

//Toggle ver puntuaciones o carrera
const changeToggleToRace = () => {
	if(toggleToRace) {
		toggleRaceButton[0].innerHTML = "Puntuación";
		scoresTable.hide();
		raceSection.show();
	} else {
		toggleRaceButton[0].innerHTML = "Carrera";
		scoresTable.show();
		raceSection.hide();
	}
	toggleToRace = !toggleToRace;
}

//Inicio de la carrera
function raceStart() {
	toggleForm();
	createRace();
	moveCars();
}

//Resetear la carrera
function raceReset() {
	$("input").val("");
	toggleForm();
}