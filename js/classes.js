/** @format */
// /*
/*class Game {
	constructor() {
		this.width = 1280;
		this.height = 768;
		this.placementTilesData2D = [];
		this.totalGold = 50; // gold :50
		this.placementTiles = [];
		this.enemies = [];

		this.buildings = [];
		this.activeTile = undefined;
		this.enemyCount = 3;
		this.mouse = {
			x: undefined,
			y: undefined,
		};
	}

	start() {
		const canvas = document.querySelector("canvas");
		const c = canvas.getContext("2d");

		canvas.width = this.width;
		canvas.height = this.height;

		c.fillStyle = "white";
		c.fillRect(0, 0, canvas.width, canvas.height);

		const image = new Image();
		image.src = "/img/game-map.png"; /// placing the map

		image.onload = () => {
			this.animate(); // activating the functionallity of the map
		};

		///placing the tiles 2d
		this.placingTiles2d();

		this.spawnEnemies(3);
		this.displayGold();

		this.attachEventListeners();
	}

	animate() {
		const animationId = requestAnimationFrame(animate);

		c.drawImage(image, 0, 0); //// draw map

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

		this.placementTiles.forEach((tile) => {
			tile.update(mouse);
		});

		this.buildings.forEach((building) => {
			building.update();
			building.target = null;

			const validEnemies = this.enemies.filter((enemy) => {
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
						this.totalGold += projectile.enemy.bounty;
					}

					building.projectiles.splice(i, 1);
				}
			}
			if (this.enemies.length === 0) {
				this.enemies.bounty += 2;
				this.enemyCount += 2;
				this.spawnEnemies(enemyCount);
			}
		});
	}

	spawnEnemies(spawnCount) {
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
			console.log("enemies", enemies);
		}
	}
	displayGold() {
		c.font = "48px serif";

		c.fillStyle = "blue";
		c.fillText(`Gold: ${totalGold}`, canvas.width - 200, 50, 220);
	}

	//placing the tiles 2d
	placingTiles2d() {
		//making the array for 20 per row
		for (let i = 0; i < this.placementTilesData.length; i += 20) {
			this.placementTilesData2D.push(this.placementTilesData.slice(i, i + 20));
		}
		///placing
		this.placementTilesData2D.forEach((row, y) => {
			row.forEach((symbol, x) => {
				if (symbol === 276) {
					this.placementTiles.push(
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
	}

	attachEventListeners() {
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
	}
}


 */

///// these are the spots that we can place a building
class PlacementTile {
	constructor({ position = { x: 0, y: 0 } }) {
		/// position is an obj
		this.position = position;
		this.width = 64;
		this.height = 64;
		this.size = 64; /// based on tiled map setup
		this.color = "rgba(0,0,255,0.1)"; //// we make them darker
		this.occupied = false;
		this.draw();
	}
	draw() {
		///// we draw the color and the square
		this.element = document.createElement("div");
		this.element.classList.add("tower-placement");
		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
		this.element.style.backgroundColor = this.color;

		const towerPlacementParent = document.getElementById("tower-placement");
		towerPlacementParent.appendChild(this.element);
	}

	update(mouse) {
		//// we render them

		///if we hover with collidition
		if (
			mouse.x > this.position.x &&
			mouse.x < this.position.x + this.size &&
			mouse.y > this.position.y &&
			mouse.y < this.position.y + this.size
		) {
			// color white over hover
			this.color = "white";
		} else this.color = "rgba(255,255,255,0.2)";
	}
}

/// this is the basic enemy and maybe dom done?
class Enemy {
	constructor({ position = { x: 0, y: 0 } }) {
		this.position = position;
		this.width = 50;
		this.height = 50;
		this.waypointIndex = 0;
		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};

		this.radius = 30;
		this.health = 100;
		this.bounty = 3;
		this.velocity = {
			x: 0,
			y: 0,
		};

		// Create a new DOM element for the enemy
		this.element = document.createElement("div");
		this.element.classList.add("enemy");
		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
		this.element.style.backgroundColor = "red";

		// Create a health bar element for the enemy
		this.healthBar = document.createElement("div");
		this.healthBar.classList.add("health-bar");

		this.element.appendChild(this.healthBar);

		// Append the enemy element to the container
		const enemyContainer = document.getElementById("enemy-container");
		enemyContainer.appendChild(this.element);
	}

	draw() {
		// Update the position of the enemy element
		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
	}

	update() {
		const waypoint = waypoints[this.waypointIndex];
		const yDistance = waypoint.y - this.center.y;
		const xDistance = waypoint.x - this.center.x;
		const angle = Math.atan2(yDistance, xDistance);

		const speed = 5;

		this.velocity.x = Math.cos(angle) * speed;
		this.velocity.y = Math.sin(angle) * speed;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};

		// Update the position of the enemy element
		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
		// Update the width of the health bar based on the enemy's health
		this.healthBar.style.width = (this.width * this.health) / 100 + "px";

		if (
			Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
				Math.abs(this.velocity.x) &&
			Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
				Math.abs(this.velocity.y) &&
			this.waypointIndex < waypoints.length - 1
		) {
			this.waypointIndex++;
		}
	}
}

class Boss extends Enemy {
	// constructor({ position = { x: 0, y: 0 }, enemy }) {
	//   super({ position, imageSrc: 'img/projectile.png' })
	//   this.velocity = {
	//     x: 0,
	//     y: 0
	//   }
	//   this.enemy = enemy
	//   this.radius = 10
	// }

	constructor({ health, bounty, position = { x: 0, y: 0 } }) {
		super({ position });
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.health = health;
		this.bounty = bounty;
		this.radius = 70;
	}

	draw() {
		super.draw(); //// talking draw from the enemies
		c.fillStyle = "pink";
	}
}

// these are the BULLETS
class Projectile {
	constructor({ position = { x: 0, y: 0 }, enemy }) {
		this.position = position;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.enemy = enemy;
		this.radius = 5; /// how big is the circle

		///drawing the circle
		this.draw();
		this.update();
	}
	draw() {
		this.element = document.createElement("div");
		this.element.classList.add("bullet");
		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
		this.element.style.backgroundColor = "black";

		const bulletContainer = document.getElementById("bullet-container");
		bulletContainer.appendChild(this.element);
	}

	///  update//move the bullet
	update() {
		const angle = Math.atan2(
			this.enemy.center.y - this.position.y,
			this.enemy.center.x - this.position.x
		);
		const power = 5; /// the speed of the bullet
		this.velocity.x = Math.cos(angle) * power;
		this.velocity.y = Math.sin(angle) * power;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
		this.element.style.backgroundColor = "black";
	}
}

class Building {
	constructor({ position = { x: 0, y: 0 } }) {
		this.position = position;
		this.width = 64;
		this.height = 64;
		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};
		this.towerPrice = 2; /// price of tower
		this.projectiles = []; /// array of bullets
		this.radius = 250; /// range collidition
		this.target;
		this.frames = 0;
	}

	draw() {
		// the placement of the tower

		this.element = document.createElement("div");
		this.element.classList.add("tower-active");
		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
		this.element.style.backgroundColor = "green";

		const towerActiveParent = document.getElementById("tower-active");
		towerActiveParent.appendChild(this.element);
	}

	update() {
		if (this.frames % 100 === 0 && this.target) {
			///if you have target hit them
			this.projectiles.push(
				new Projectile({
					position: {
						x: this.center.x,
						y: this.center.y,
					},
					enemy: this.target, /// this target
				})
			);
		}
		this.frames++;
	}
}
