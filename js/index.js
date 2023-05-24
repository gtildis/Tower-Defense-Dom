/** @format */

let levels = localStorage.getItem("levels");
function storeLevel() {
	if (!levels) {
		levels = 1;
		localStorage.setItem("levels", levels);
	}
}
storeLevel();

console.log("level 😎", levels);
function checkLevel() {
	if (levels === "1") {
		winDiv.style.display = "none";
		const game = new Game();
	} else if (levels === "2") {
		winDiv.style.display = "none";

		const game2 = new GameLvlTwo();
	} else if (levels !== "1" || levels !== "2") {
		const game = new Game();
	}
}
checkLevel();
