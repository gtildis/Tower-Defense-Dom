/** @format */

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
		this.element.style.top = this.position.y - 64 + "px";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height * 2 + "px";

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
