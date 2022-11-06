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
let toggleToStart = true;
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


//Inicio de la carrera
function raceStart() {
	toggleForm();
	createRace();
	//moveCars();
}

//Resetear la carrera
function raceReset() {
	$("input").val("");
	toggleForm();
}

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
		let player = {img: `./img/car${i}.png`, position: 0}
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
		const totalPosition = players[index].position + movement;
		players[index].position = totalPosition; 
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
	}
}