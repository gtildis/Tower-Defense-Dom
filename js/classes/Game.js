/** @format */

const winDiv = document.querySelector("#you-win");
class Game {
	constructor() {
		this.gameBackground = document.getElementById("game-background");
		this.gameBackground.style.backgroundImage = "url('./img/game-map.png')";
		this.animationId; ///////
		this.isAnimationPaused = false;
		this.isActiveTower = true;
		this.isUpgradeTower = false;

		this.placementTilesData2D = [];
		this.enemies = [];

		this.projectileElms = document.getElementsByClassName("bullet");
		this.hearts = 5;
		this.totalGold = 50;
		this.countWave = 0;
		this.placementTiles = [];
		this.buildings = [];
		this.activeTile = undefined;
		this.enemyCount = 3;

		this.mouse = {
			x: undefined,
			y: undefined,
		};

		this.animate = this.animate.bind(this);
		this.spawnEnemies = this.spawnEnemies.bind(this);
		this.checkIfWin = this.checkIfWin.bind(this);
		this.eventListeners = this.eventListeners.bind(this);
		this.availablePlacing = this.availablePlacing.bind(this);

		this.gameBackground.onload = () => {
			this.animate();
		};
		this.availablePlacing(placementTilesData[0]);

		this.eventListeners(this.gameBackground);
		///////////////////////////////////////////////////////////////////////////////////
		this.spawnEnemies(4); ///initial 4
	}

	availablePlacing(placementTilesData) {
		for (let i = 0; i < placementTilesData.length; i += 20) {
			this.placementTilesData2D.push(placementTilesData.slice(i, i + 20));
		}

		// adding a building placement tile //11
		this.placementTilesData2D.forEach((row, y) => {
			row.forEach((symbol, x) => {
				if (symbol === 276) {
					let placementTile = new PlacementTile({
						position: {
							x: x * 64,
							y: y * 64,
						},
					});

					placementTile.draw(); // Call the draw() method

					this.placementTiles.push(placementTile);
				}
			});
		});
	}

	eventListeners() {
		const activeTower = document.querySelector("#building-simple");
		const activeUpgradeTower = document.querySelector("#building-frost");

		const activateTower = () => {
			activeTower.classList.add("glow-button");
			activeUpgradeTower.classList.remove("glow-button");
			this.isActiveTower = true;
			this.isUpgradeTower = false;
		};

		const activateUpgradeTower = () => {
			activeUpgradeTower.classList.add("glow-button");
			activeTower.classList.remove("glow-button");
			this.isActiveTower = false;
			this.isUpgradeTower = true;
		};

		activeTower.addEventListener("click", activateTower);
		activeUpgradeTower.addEventListener("click", activateUpgradeTower);

		document.addEventListener("keydown", (event) => {
			if (event.key === "1") {
				activateTower();
			} else if (event.key === "2") {
				activateUpgradeTower();
			}
		});

		this.gameBackground.addEventListener("click", (event) => {
			if (
				this.activeTile &&
				!this.activeTile.occupied &&
				this.totalGold >= 10 &&
				this.isActiveTower
			) {
				this.buildings.push(
					new Building({
						position: {
							x: this.activeTile.position.x,
							y: this.activeTile.position.y,
						},
					})
				);

				this.buildings[this.buildings.length - 1].draw();
				this.activeTile.occupied = true;
				this.totalGold -= 10;
			} else if (
				this.activeTile &&
				!this.activeTile.occupied &&
				this.totalGold >= 20 &&
				this.isUpgradeTower
			) {
				this.buildings.push(
					new FrostTower({
						position: {
							x: this.activeTile.position.x,
							y: this.activeTile.position.y,
						},
					})
				);

				this.buildings[this.buildings.length - 1].draw();
				this.activeTile.occupied = true;
				this.totalGold -= 20;
			}
		});

		window.addEventListener("mousemove", (event) => {
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;

			this.activeTile = null;

			for (let i = 0; i < this.placementTiles.length; i++) {
				const tile = this.placementTiles[i];

				if (
					this.mouse.x > tile.position.x &&
					this.mouse.x < tile.position.x + tile.size &&
					this.mouse.y > tile.position.y &&
					this.mouse.y < tile.position.y + tile.size
				) {
					this.activeTile = tile;

					break;
				}
			}
		});
	}

	animate() {
		const animationId = requestAnimationFrame(this.animate);

		this.checkIfWin(animationId);
		this.displayGold();

		for (let i = this.enemies.length - 1; i >= 0; i--) {
			const enemy = this.enemies[i];
			enemy.update();

			if (enemy.position.y > 820) {
				this.hearts -= 1;
				const heartsClass = document.getElementsByClassName("hearts");
				let lastHeartIndex = heartsClass.length - 1;

				for (let i = lastHeartIndex; i >= 0; i--) {
					let heart = heartsClass[i];
					if (!heart.classList.contains("hidden")) {
						heart.classList.add("hidden");
						break;
					}
				}

				this.enemies.splice(i, 1);
				enemy.element.remove();

				if (this.enemies.length === 0) {
					this.enemyCount += 2;
					this.spawnEnemies(this.enemyCount);
					this.countWave++;
					console.log(this.countWave);
				}

				if (this.hearts === 0) {
					this.hearts = 0;
					const gameOverDiv = document.createElement("div");
					gameOverDiv.innerHTML = `
            <div id="game-over">
              <h1>GAME OVER</h1>
              <a id='play-again' href="index.html">Play again</a>
            </div>
          `;
					this.gameBackground.appendChild(gameOverDiv);

					localStorage.clear();
					localStorage.removeItem("levels");
					cancelAnimationFrame(animationId);
				}
			}
		}

		this.placementTiles.forEach((tile) => {
			tile.update(this.mouse);
		});

		this.buildings.forEach((building) => {
			building.update();
			building.target = null;

			const validEnemies = this.enemies.filter((enemy) => {
				const xDifference = enemy.center.x - building.center.x;
				const yDifference = enemy.center.y - building.center.y;
				const distance = Math.hypot(xDifference, yDifference);
				return distance < enemy.radius + building.radius;
			});

			building.target = validEnemies[0];

			for (let i = building.projectiles.length - 1; i >= 0; i--) {
				const projectile = building.projectiles[i];

				const projectileElm = this.projectileElms[i];
				projectile.update();

				const xDifference = projectile.enemy.center.x - projectile.position.x;
				const yDifference = projectile.enemy.center.y - projectile.position.y;
				const distance = Math.hypot(xDifference, yDifference);

				if (distance < projectile.enemy.radius + projectile.radius) {
					projectile.enemy.health -= projectile.damage;

					if (projectile.isSlow && !projectile.enemy.isNotAffectedByFrost) {
						projectile.enemy.speed *= 50 / 100;
						setTimeout(function () {
							projectile.enemy.speed *= 100 / 50;
						}, 2000);
					}

					if (projectile.enemy.health <= 0) {
						const enemyIndex = this.enemies.findIndex((enemy) => {
							return projectile.enemy === enemy;
						});

						if (enemyIndex > -1) {
							this.totalGold += projectile.enemy.bounty;
							const enemyElements = document.getElementsByClassName("enemy");
							if (enemyElements.length > enemyIndex) {
								const enemyElement = enemyElements[enemyIndex];
								enemyElement.remove();
								this.enemies.splice(enemyIndex, 1);
							}
						}
					}
					projectileElm.remove();
					building.projectiles.splice(i, 1);
				}
			}

			if (this.enemies.length === 0) {
				this.enemyCount += 2;
				this.spawnEnemies(this.enemyCount);
				this.countWave++;
			}
		});
	}

	spawnEnemies(spawnCount) {
		for (let i = 1; i < spawnCount + 1; i++) {
			const xOffset = i * 150;
			this.enemies.push(
				new Enemy({
					position: { x: waypoints[0][0].x - xOffset, y: waypoints[0][0].y },
				})
			);
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////
	checkIfWin(animationId) {
		if (this.countWave === 4) {
			winDiv.style.display = "flex";
			let currentLevel = +localStorage.getItem("levels");
			currentLevel++;
			localStorage.setItem("levels", currentLevel);

			document.querySelector("#play-again").addEventListener("click", () => {
				localStorage.clear();
			});

			document
				.querySelector("#next-lvl-btn")
				.addEventListener("click", checkLevel);

			cancelAnimationFrame(animationId);
		}
	}

	displayGold() {
		const scoreTable = document.getElementById("score-table");
		const goldTable = document.getElementById("gold-container");
		goldTable.innerText = `${this.totalGold}`;
	}
}
