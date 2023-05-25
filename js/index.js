/** @format */

let levels = localStorage.getItem("levels");
function storeLevel() {
	if (!levels) {
		levels = 1;
		localStorage.setItem("levels", levels);
	}
}
storeLevel();

function howToPlay() {
	const openModalButton = document.querySelector(".open-modal-btn");
	const closeModalButton = document.querySelector(".close-modal-btn");
	const overlay = document.getElementById("overlay");
	const modal = document.getElementById("modal");

	openModalButton.addEventListener("click", (e) => {
		overlay.classList.add("active");
		modal.classList.add("active");
	});

	closeModalButton.addEventListener("click", (e) => {
		overlay.classList.remove("active");
		modal.classList.remove("active");
	});
}
howToPlay();

console.log("level 😎", levels);

function checkLevel() {
	if (levels === "1") {
		winDiv.style.display = "none";
		const game = new Game();
	} else if (levels === "2") {
		winDiv.style.display = "none";
		const game2 = new GameLvlTwo();
	} else if (levels === "3") {
		winDiv.style.display = "none";
		const game3 = new GameLvlThree();
	} else {
		winDiv.style.display = "none";
		const game = new Game();
	}
}

checkLevel();
