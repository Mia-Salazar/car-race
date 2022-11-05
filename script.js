//Variables generales
const form = $("#form");
const startButton = $("#startButton");
const resetButton = $("#resetButton");
const formInputs = $(".input-container");
const numberOfPlayers = $("#numberOfPlayers")[0];
const scoreFinal = $("#winningScore"); 
const raceLines = $("#raceLines")[0];
const raceSection = $("#raceLines")[0];
let toggleToStart = true;

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
	console.log(1)
	createRace();
	toggleForm();
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
		resetButton.hide();
		startButton.show();
		formInputs.show();
		raceSection.hide();
	}
	toggleToStart = !toggleToStart;
}

//Crear líneas de competición
const createRace = () => {
	console.log(2, Number(numberOfPlayers.value))
	for (let i = 1; i <= Number(numberOfPlayers.value); i++){
		console.log('holi', i)
		let li = document.createElement("li");
		let img = document.createElement("img");

		img.alt=`coche número ${i}`;
		img.src=`./img/car${i}.png`;

		li.appendChild(img);
		raceLines.appendChild(li);
	};
}