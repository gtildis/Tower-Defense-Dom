/** @format */

/// this is the basic enemy and maybe dom done?
class Enemy {
	constructor({ position = { x: 0, y: 0 } }) {
		this.position = position;
		this.width = 48;
		this.height = 48;
		this.waypointIndex = 0;
		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};

		this.radius = 30;
		this.health = 200;
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
		this.element.style.height = this.height + "px";
		this.element.style.width = this.width + "px";
		// this.element.style.backgroundColor = "red";

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

		const speed = 1.5;

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
		this.healthBar.style.width = (this.width * this.health) / 100 / 2 + "px";

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
