/** @format */

/** @format */
const gameBackground = document.getElementById("game-background");

const placementTilesData2D = [];
const enemies = [];
const projectileElms = document.getElementsByClassName("bullet");
let hearts = 5;
let totalGold = 50;
let countWave = 0;
const placementTiles = [];

/***********************************Placing the tiles on the map************************ */
/***********************************Placing the tiles on the map************************ */

for (let i = 0; i < placementTilesData.length; i += 20) {
	placementTilesData2D.push(placementTilesData.slice(i, i + 20));
}

// adding a building placement tile //11
placementTilesData2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 276) {
			let placementTile = new PlacementTile({
				position: {
					x: x * 64,
					y: y * 64,
				},
			});

			placementTile.draw(); // Call the draw() method

			placementTiles.push(placementTile);
		}
	});
});

// Animation condition
function animate() {
	const animationId = requestAnimationFrame(animate);
	checkIfWin(animationId);
	displayGold();

	for (let i = enemies.length - 1; i >= 0; i--) {
		const enemy = enemies[i]; // Get the current enemy

		enemy.update(); // Update the enemy

		if (enemy.position.y > 820) {
			hearts -= 1;

			const heartsClass = document.getElementsByClassName("hearts");
			let lastHeartIndex = heartsClass.length - 1;

			// for hearts elements loop their index
			for (let i = lastHeartIndex; i >= 0; i--) {
				let heart = heartsClass[i]; // take the specific one

				/// MAYBE here i will change that to toggle with another icon in the future that represent a broken heart
				if (!heart.classList.contains("hidden")) {
					heart.classList.add("hidden");
					break;
				}
			}

			enemies.splice(i, 1); // Remove the enemy from the array
			enemy.element.remove();
			if (enemies.length === 0) {
				enemyCount += 2;
				spawnEnemies(enemyCount);
				countWave++;
				console.log(countWave);
			}

			//////   game over
			if (hearts === 0) {
				hearts = 0;

				const gameOverDiv = document.createElement("div");
				gameOverDiv.innerHTML = `
					<div id="game-over">
						<h1>GAME OVER</h1>
						<a href="index.html">Play again</a>
					</div>
				`;
				gameBackground.appendChild(gameOverDiv);

				cancelAnimationFrame(animationId);
			}
		}
	}

	placementTiles.forEach((tile) => {
		tile.update(mouse);
	});

	buildings.forEach((building) => {
		building.update();
		building.target = null;

		const validEnemies = enemies.filter((enemy) => {
			//its the enemy who is closer to the building
			const xDifference = enemy.center.x - building.center.x;
			const yDifference = enemy.center.y - building.center.y;
			const distance = Math.hypot(xDifference, yDifference);

			//if the ranges are collision THEN its a valid enemy
			return distance < enemy.radius + building.radius;
		});
		//target the first of the valid enemies array
		building.target = validEnemies[0];

		for (let i = building.projectiles.length - 1; i >= 0; i--) {
			/// for each projectile
			const projectile = building.projectiles[i];
			const projectileElm = projectileElms[i];

			projectile.update(); // access the animation

			const xDifference = projectile.enemy.center.x - projectile.position.x;
			const yDifference = projectile.enemy.center.y - projectile.position.y;
			const distance = Math.hypot(xDifference, yDifference);

			if (distance < projectile.enemy.radius + projectile.radius) {
				projectile.enemy.health -= 20;
				if (projectile.enemy.health <= 0) {
					const enemyIndex = enemies.findIndex((enemy) => {
						return projectile.enemy === enemy;
					});
					if (enemyIndex > -1) {
						const enemyElements = document.getElementsByClassName("enemy"); //

						if (enemyElements.length > enemyIndex) {
							const enemyElement = enemyElements[enemyIndex];
							enemyElement.remove(); // Remove the enemy element from the DOM
							enemies.splice(enemyIndex, 1);
						}

						totalGold += projectile.enemy.bounty;
					}
				}
				projectileElm.remove();
				building.projectiles.splice(i, 1);
			}
		}
		if (enemies.length === 0) {
			// enemies.bounty += 2;
			enemyCount += 2;
			spawnEnemies(enemyCount);
			countWave++;
			console.log(countWave);
		}
	});
}
console.log(this.enemies);

gameBackground.onload = () => {
	animate(); // activating the functionallity of the map
};

/***********************************Spawn the enemies************************ */
/***********************************Spawn the enemies************************ */

function spawnEnemies(spawnCount) {
	for (let i = 1; i < spawnCount + 1; i++) {
		const xOffset = i * 150;
		enemies.push(
			/////	 IDEA count waves if its number % 5 ===0 then spawn Boss
			///////
			new Enemy({
				position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
			})
			// new Boss({
			// 	health: 500,
			// 	bounty: 100,
			// 	position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
			// })
		);
		// console.log("enemies", enemies);
	}
}
spawnEnemies(3); ////spawning initial wave

const buildings = [];
let activeTile = undefined;
let enemyCount = 3;

/***********************************Check if winnin************************ */
/***********************************Check if winnin************************ */

const checkIfWin = function (animationId) {
	if (countWave === 5) {
		const youWinDiv = document.createElement("div");
		youWinDiv.innerHTML = `
				<div id="you-win">
					<h1>You Win</h1>
					<a href="index.html">Play again</a>
				</div>
		`;
		gameBackground.appendChild(youWinDiv);
		cancelAnimationFrame(animationId);
	}
};

/***********************************display the gold************************ */
function displayGold() {
	const scoreTable = document.getElementById("score-table");

	const goldTable = document.getElementById("gold-container");
	goldTable.innerText = `${totalGold}`;
}

/************************************************************
 *          																								  *
 *    					EVENT LISTENERS											          *
 *                             								              *
 *************************************************************/

const mouse = {
	x: undefined,
	y: undefined,
};

////// if tile is not occupied and active and you have gold place a bulding and added on the array
gameBackground.addEventListener("click", (event) => {
	if (activeTile && !activeTile.occupied && totalGold > 10) {
		buildings.push(
			new Building({
				position: {
					x: activeTile.position.x,
					y: activeTile.position.y,
				},
			})
		);

		buildings[buildings.length - 1].draw();
		activeTile.occupied = true;
		totalGold >= 10 ? (totalGold -= 10) : 0; /////// total gold >= 10? //  gold -10 //
	}
});

///// functionallity for active tile
window.addEventListener("mousemove", (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;

	activeTile = null;

	for (let i = 0; i < placementTiles.length; i++) {
		///for each tile placement CHECK if it is available to build
		const tile = placementTiles[i]; ////this are the active placements

		if (
			// if mouse
			mouse.x > tile.position.x &&
			mouse.x < tile.position.x + tile.size &&
			mouse.y > tile.position.y &&
			mouse.y < tile.position.y + tile.size
		) {
			// const square = document.getElementById("square");

			// square.style.left = tile.position.x;
			// square.style.top = tile.position.y;
			// square.style.width = 64 + "px";
			// square.style.height = 64 + "px";
			// square.style.backgroundColor = "blue";

			activeTile = tile;

			break;
		}
	}
});