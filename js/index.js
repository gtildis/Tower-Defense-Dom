/** @format */

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // background

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// console.log(placementTilesData);
const placementTilesData2D = [];
let totalGold = 50; // gold :50

for (let i = 0; i < placementTilesData.length; i += 20) {
	placementTilesData2D.push(placementTilesData.slice(i, i + 20));
}
const placementTiles = [];

//adding a building placement tile
placementTilesData2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 276) {
			placementTiles.push(
				new PlacementTile({
					position: {
						x: x * 64,
						y: y * 64,
					},
				})
			);
		}
	});
});

const image = new Image();
image.src = "/img/game-map.png"; /// placing the map

image.onload = () => {
	animate(); // activating the functionallity of the map
};

const enemies = [];

///// Spawning the enemies
function spawnEnemies(spawnCount) {
	for (let i = 1; i < spawnCount + 1; i++) {
		const xOffset = i * 150;
		enemies.push(
			/////	 IDEA count waves if its number % 5 ===0 then spawn Boss
			///////
			new Enemy({
				position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
			}),
			new Boss({
				health: 500,
				bounty: 100,
				position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
			})
		);
		console.log("enemies", enemies);
	}
}
spawnEnemies(3); ////spawning initial wave

const buildings = [];
let activeTile = undefined;
let enemyCount = 3;

//////// display the gold
function displayGold() {
	c.font = "48px serif";

	c.fillStyle = "blue";
	c.fillText(`Gold: ${totalGold}`, canvas.width - 200, 50, 220);
}

////// rendering everything
function animate() {
	const animationId = requestAnimationFrame(animate);

	c.drawImage(image, 0, 0); //// draw map

	displayGold();

	for (let i = enemies.length - 1; i >= 0; i--) {
		const enemy = enemies[i]; // for each enemy
		enemy.update(); /// render update of enemy

		if (enemy.position.x > canvas.width) {
			hearts -= 1;
			enemies.splice(i, 1);
			document.querySelector("#hearts").innerHTML = hearts;

			if (hearts === 0) {
				///// GAME OVER
				console.log("game over");
				cancelAnimationFrame(animationId);
				document.querySelector("#gameOver").style.display = "flex";
			}
		}
	}
	// console.log(this.enemy);

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

			//if the ranges are collidition THEN its a valid enemy
			return distance < enemy.radius + building.radius;
		});
		//target the first of the valid enemies array
		building.target = validEnemies[0];

		for (let i = building.projectiles.length - 1; i >= 0; i--) {
			const projectile = building.projectiles[i]; /// for each projectile

			projectile.update();

			const xDifference = projectile.enemy.center.x - projectile.position.x;
			const yDifference = projectile.enemy.center.y - projectile.position.y;
			const distance = Math.hypot(xDifference, yDifference);

			if (distance < projectile.enemy.radius + projectile.radius) {
				projectile.enemy.health -= 20;
				if (projectile.enemy.health <= 0) {
					const enemyIndex = enemies.findIndex((enemy) => {
						return projectile.enemy === enemy;
					});
					if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
					totalGold += projectile.enemy.bounty;
				}

				building.projectiles.splice(i, 1);
			}
		}
		if (enemies.length === 0) {
			enemies.bounty += 2;
			enemyCount += 2;
			spawnEnemies(enemyCount);
		}
	});
}
const mouse = {
	x: undefined,
	y: undefined,
};

////// if tile is not occupied and active and you have gold place a bulding and added on the array
canvas.addEventListener("click", (event) => {
	if (activeTile && !activeTile.isOccupied && totalGold > 10) {
		buildings.push(
			new Building({
				position: {
					x: activeTile.position.x,
					y: activeTile.position.y,
				},
			})
		);
		activeTile.isOccupied = true;
	}
	totalGold >= 10 ? (totalGold -= 10) : 0; /////// total gold >= 10? //  gold -10 //
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
			// if mouse collidition
			mouse.x > tile.position.x &&
			mouse.x < tile.position.x + tile.size &&
			mouse.y > tile.position.y &&
			mouse.y < tile.position.y + tile.size
		) {
			activeTile = tile;
			break;
		}
	}
});
