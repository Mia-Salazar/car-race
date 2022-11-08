//Variables generales
const startButton = $("#startButton");
const resetButton = $("#resetButton");
const numberOfPlayers = $("#numberOfPlayers")[0];
const scoreFinal = $("#winningScore")[0]; 
const raceLines = $("#raceLines")[0];
const raceSection = $("#race");
const scoresTable = $("#scores");
const scoresBody = $("#scoresBody")[0];
const toggleRaceButton = $("#toggleRaceButton");
let toggleToRace = true;
let isReseted = false;
let players = [];
let winner = false;

//Añadir event listeners
$("#form").on("submit", function (e) {
	e.preventDefault();
    raceStart();
});
$("#form").on("reset", function (e) {
	e.preventDefault();
    raceReset();
});
toggleRaceButton.on("click", function () {
	changeToggleToRace();
});


//Crear líneas de competición
const createRace = () => {
	//Reiniciamos los valores
	players= [];
	scoresBody.innerHTML = "";
	raceLines.innerHTML = "";
	//Por cada uno de los jugadores que se hayan escogido, creamos una línea de carrera
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
	//Una vez creados todas las líneas, iniciamos la carrera
	moveCars();
}

//Hacemos que los coches vuelvan al inicio
const resetPositions = () => {
	players.forEach((player, index) => {
		$(`#${++index}`).animate({marginLeft: 0});
	});
}

//Movimiento de los coches
const moveCars = () => {	
	//Si acabamos de resetear a carrera, no seguirán moviéndose los coches
	if (!isReseted) {
		//Por cada jugador que haya, le vamos sumamos a su posición un valor entre 1 y 10
		//Este valor es que usaremos para que sea su margin-left y así el coche se vaya desplazando
		players.forEach((player, index) => {
			const movement = Math.floor(Math.random() * 10) + 1;
			const totalPosition = players[index].score + movement;
			players[index].score = totalPosition; 
			$(`#${++index}`).animate({marginLeft: totalPosition}, 100);
			//Si el margen total es mayor que el valor de meta, tendremos ganador
			if (totalPosition >= scoreFinal.value) {
				winner = true;
			}
		});
		//Si no tenemos ganador, volvemos a llamar a la función
		if (!winner) {
			setTimeout(moveCars, 100);
		} else {
			scoresTable.show();
			raceSection.hide();
			resetButton.show();
			startButton.hide();
			toggleRaceButton.show();
			createScoreTable();
		}
	} else {
		//Si se ha reseteado la carrera, ponemos todos los coches al principio
		resetPositions();
	}
}

//Crear tablas con puntuaciones
const createScoreTable = () => {
	//Ordenamos los jugadores según su puntuación
	const sortedPlayer = players.sort((a, b) => (a.score > b.score) ? -1 : 1);
	//Por cada jugador creamos una fila nueva en la tabla con sus datos
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
	//Si están viendo el resultado de la carrera, le ocultamos la tabla de puntuaciones y le mostramos la carrera
	if(toggleToRace) {
		toggleRaceButton[0].innerHTML = "Puntuación";
		scoresTable.hide();
		raceSection.show();
	} else {
	//Si están viendo la tabla de resultados, le ocultamos la carrera y le mostramos la tabla de puntuaciones
		toggleRaceButton[0].innerHTML = "Carrera";
		scoresTable.show();
		raceSection.hide();
	}
	toggleToRace = !toggleToRace;
}

//Inicio de la carrera y reiniciamos valores
function raceStart() {
	winner = false;
	isReseted = false;
	toggleRaceButton[0].innerHTML = "Carrera";
	resetButton.show();
	raceSection.show();
	startButton.hide();
	createRace();
}

//Reiniciamos la carrera
function raceReset() {
	if (winner) {
		resetPositions();
	}
	isReseted  = true;
	toggleToRace = true;
	scoresTable.hide();
	raceSection.show();
	resetButton.hide();
	startButton.show();
	toggleRaceButton.hide();
}