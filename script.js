$(document).ready(function () {
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
	const inputs = $(".select, .input");
	let numberOfWinners = 0;
	let toggleToRace = true;
	let isReseted = false;
	let players = [];

	//Manejamos los eventos
	$("#form").on("submit", function (e) {
		e.preventDefault();
		raceStart();
	});
	$("#form").on("reset", function (e) {
		e.preventDefault();
		raceReset();
	});
	toggleRaceButton.click(function () {
		changeToggleToRace();
	})


	//Crear líneas de competición
	const createRace = () => {
		//Reiniciamos los valores
		players= [];
		scoresBody.innerHTML = "";
		raceLines.innerHTML = "";
		//Por cada uno de los jugadores que se hayan escogido, creamos una línea de carrera
		for (let i = 1; i <= Number(numberOfPlayers.value); i++){
			let player = {img: `./img/car${i}.png`, number: i, score: 0, position: 0}
			let li = document.createElement("li");
			let img = document.createElement("img");
			let figure = document.createElement("figure");

			figure.setAttribute("id",i);
			img.alt=`coche número ${i}`;
			img.src=player.img;

			players.push(player);
			figure.appendChild(img);
			li.appendChild(figure);
			raceLines.appendChild(li);
		};
		//Una vez creadas todas las líneas, iniciamos la carrera
		moveCars();
	}

	//Hacemos que los coches vuelvan al inicio
	const resetPositions = () => {
		players.forEach((player, index) => {
			$(`#${++index}`).animate({marginLeft: 0});
		});
	}

	//Cambiamos al valor a uno porcentual
	const valueAccordingToFinishLine = (value) => {
		const screenSizeWithPaddingWithGoaldAndCar = $("#screen")[0].offsetWidth - 20 - 20 - 40 - 60; 
		const result = screenSizeWithPaddingWithGoaldAndCar/ scoreFinal.value * value ;
		if(result >= screenSizeWithPaddingWithGoaldAndCar) {
			return screenSizeWithPaddingWithGoaldAndCar; 
		}
		return result;
	}

	//Movimiento de los coches
	const moveCars = () => {	
		//Si acabamos de resetear la carrera, no seguirán moviéndose los coches
		if (!isReseted) {
			//Por cada jugador que haya, le sumamos a su posición un valor entre 1 y 10
			//Este valor es que usaremos para que sea su margin-left y así el coche se vaya desplazando
			players.forEach((player, index) => {
				//Si el jugador ya ha llegado a la meta, no seguirá moviéndose
				if (player.position === 0) {
					const movement = Math.floor(Math.random() * 10) + 1;
					const totalPosition = player.score + movement;
					player.score = totalPosition; 
					$(`#${++index}`).animate({marginLeft: valueAccordingToFinishLine(totalPosition)}, 150);
					//Si el margen total es mayor que el valor de meta, habrá llegado al final y le daremos una posición
					if (totalPosition > scoreFinal.value) {
						++numberOfWinners;
						player.position = numberOfWinners;	
					}
				}
			});
			//Si no han llegado todos a la meta, volveremos a llamar a la función que mueve los coches
			if (numberOfWinners < players.length) {
				setTimeout(moveCars, 150);
			} else {
				//Si ha llegado a la meta, enseñamos la tabla de puntuaciones y la creamos
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
		const sortedPlayer = players.sort((a, b) => (a.position < b.position) ? -1 : 1);
		//Por cada jugador creamos una fila nueva en la tabla con sus datos
		sortedPlayer.forEach((sortedPlayer, index) => {
			let tr = document.createElement("tr");
			let position = document.createElement("td");
			let player = document.createElement("td");

			position.innerHTML = ++index;
			player.innerHTML = sortedPlayer.number;

			tr.appendChild(position);
			tr.appendChild(player);
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

	//Iniciamos la carrera y reiniciamos valores
	function raceStart() {
		isReseted = false;
		numberOfWinners = 0;
		toggleRaceButton[0].innerHTML = "Carrera";
		resetButton.show();
		raceSection.show();
		startButton.hide();
		inputs.prop('disabled', true);
		createRace();
	}

	//Reiniciamos la carrera y sus valores
	function raceReset() {
		if (numberOfWinners !== scoreFinal.value) {
			resetPositions();
		}
		inputs.prop('disabled', false);
		isReseted = true;
		toggleToRace = true;
		scoresTable.hide();
		raceSection.show();
		resetButton.hide();
		startButton.show();
		toggleRaceButton.hide();
	}
});