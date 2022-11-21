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
	let raceDuration = 0;
	let toggleToRace = true;
	let players = [];
	let waitFinalRace;

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
	});

	//Mostrar tabla cuando termine la carrera
	const showTable = () => {
		if (raceDuration !== 0) {
			scoresTable.show();
			raceSection.css("display", "none");
			resetButton.show();
			startButton.hide();
			toggleRaceButton.show();
			createScoreTable();
		}
	}

	//Crear líneas de competición
	const createRace = () => {
		//Reiniciamos los valores
		players= [];
		scoresBody.innerHTML = "";
		raceLines.innerHTML = "";
		const inputValue = Number(scoreFinal.value);
		const carsWidth = 60;
		const raceLine = inputValue + carsWidth;
		$(".race-section:after").css("left", inputValue);
		//Por cada uno de los jugadores que se hayan escogido, creamos una línea de carrera
		for (let i = 1; i <= Number(numberOfPlayers.value); i++){
			
			let player = {img: `./img/car${i}.png`, number: i, score: 0}
			let li = document.createElement("li");
			let img = document.createElement("img");
			let figure = document.createElement("figure");

			li.style.width = `${raceLine}px`;
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
			const number = ++index;
			$(`#${number}`).stop();
			$(`#${number}`).animate({marginLeft: 0});
		});
	}

	//Movimiento de los coches
	const moveCars = () => {
		//Por cada jugador que haya, calculamos la velocidad del margin-left con un valor entre 1 y 10
		players.forEach((player, index) => {
			const movement = Math.random() * 10 + 1;
			const realMovement = movement * 1000;
			//Guardamos cuál es el tiempo más largo para llegar a meta
			if (raceDuration < realMovement) {
				raceDuration = realMovement;
			}
			//Guardamos el valor aleatorio ya que marcará quién llegó antes
			player.score = movement; 
			$(`#${++index}`).animate({marginLeft: scoreFinal.value}, realMovement, "linear");
		});
		//Usamos un setTimeout para que no salga la tabla hasta que hayan terminado todos usando raceDuration
		waitFinalRace = setTimeout(showTable, raceDuration + 500);
	}

	//Crear tablas con puntuaciones
	const createScoreTable = () => {
		//Ordenamos los jugadores según su puntuación
		const sortedPlayer = players.sort((a, b) => (a.score < b.score) ? -1 : 1);
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
			raceSection.css("display", "flex");
		} else {
		//Si están viendo la tabla de resultados, le ocultamos la carrera y le mostramos la tabla de puntuaciones
			toggleRaceButton[0].innerHTML = "Carrera";
			scoresTable.show();
			raceSection.css("display", "none");
		}
		toggleToRace = !toggleToRace;
	}

	//Iniciamos la carrera y reiniciamos valores
	function raceStart() {
		//Comprobamos si han introducido un valor mayor que el ancho de la pantalla
		const screenSizeWithPaddingWithGoaldAndCar = $("#screen")[0].offsetWidth - 20 - 20 - 60 - 40;
		if (scoreFinal.value > screenSizeWithPaddingWithGoaldAndCar) {
			alert(`No puede escoger una línea de meta mayor que el ancho de la pantalla. El máximo de tu pantalla es ${screenSizeWithPaddingWithGoaldAndCar}`);
			return;
		} 
		toggleRaceButton[0].innerHTML = "Carrera";
		resetButton.show();
		raceSection.css("display", "flex");
		startButton.hide();
		inputs.prop('disabled', true);
		createRace();
	}

	//Reiniciamos la carrera y sus valores
	function raceReset() {
		//Limpiamos el setTimeout para que no siga esperando para poner la tabla
		clearTimeout(waitFinalRace);
		resetPositions();
		inputs.prop('disabled', false);
		toggleToRace = true;
		raceDuration = 0;
		scoresTable.hide();
		raceSection.css("display", "flex");
		resetButton.hide();
		startButton.show();
		toggleRaceButton.hide();
	}
});