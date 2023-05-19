/** @format */

///// these are the spots that we can place a building
class PlacementTile {
	constructor({ position = { x: 0, y: 0 } }) {
		/// position is an obj
		this.position = position;
		this.size = 64; /// based on tiled map setup
		this.color = "rgba(255,255,255,0.2)"; //// we make them darker
		this.occupied = false;
	}
	draw() {
		///// we draw the color and the square
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.size, this.size);
	}

	update(mouse) {
		this.draw(); //// we render them

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

/// this is the basic enemy
class Enemy {
	constructor({ position = { x: 0, y: 0 } }) {
		this.position = position; //// position is an obj

		this.width = 50;
		this.height = 50;

		this.waypointIndex = 0; // this is the initial index of their walkpath

		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};

		this.radius = 30; //// this is r from the circle
		this.health = 100;
		this.bounty = 3; //  ?
		this.velocity = {
			x: 0,
			y: 0,
		};
	}

	draw() {
		/// their color and shape
		c.fillStyle = "red";
		// c.fillStyle = "green";
		c.beginPath();
		c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
		c.fill();

		/// 2 health bar one is decreasing when they got hit
		c.fillStyle = "red";
		c.fillRect(this.position.x, this.position.y - 15, this.width, 10);
		c.fillStyle = "green";
		c.fillRect(
			this.position.x,
			this.position.y - 15,
			(this.width * this.health) / 100,
			10
		);
	}

	update() {
		this.draw(); ///draw the enemy again in every update

		//the first walkpath point
		const waypoint = waypoints[this.waypointIndex];
		const yDistance = waypoint.y - this.center.y;
		const xDistance = waypoint.x - this.center.x;
		const angle = Math.atan2(yDistance, xDistance); /// i cant explain that XD

		const speed = 1.5;

		this.velocity.x = Math.cos(angle) * speed;
		this.velocity.y = Math.sin(angle) * speed;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};

		if (
			/// if collidtion with waypoint index
			Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
				Math.abs(this.velocity.x) &&
			Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
				Math.abs(this.velocity.y) &&
			this.waypointIndex < waypoints.length - 1
		) {
			this.waypointIndex++; /// go to next waypointIndex
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
	}

	///drawing the circle
	draw() {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = "orange";
		c.fill();
	}

	///  update//move the bullet
	update() {
		this.draw();
		const angle = Math.atan2(
			this.enemy.center.y - this.position.y,
			this.enemy.center.x - this.position.x
		);
		const power = 5; /// the speed of the bullet
		this.velocity.x = Math.cos(angle) * power;
		this.velocity.y = Math.sin(angle) * power;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
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
		c.fillStyle = "blue";
		c.fillRect(this.position.x, this.position.y, this.width, 64);

		// the range
		c.beginPath();
		c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = "rgba(0,0,255,0.2)";
		c.fill();
	}

	update() {
		// draw them again
		this.draw();
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
