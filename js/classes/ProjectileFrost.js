/** @format */

class ProjectileFrost {
	constructor({ position = { x: 0, y: 0 }, enemy }) {
		this.damage = 30;
		this.position = position;
		this.isSlow = true;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.enemy = enemy;
		this.radius = 5; /// how big is the circle

		this.draw();
		this.update();
	}
	draw() {
		this.element = document.createElement("div");
		this.element.classList.add("bullet");
		this.element.classList.add("bullet-frost");

		const bulletContainer = document.getElementById("bullet-container");
		bulletContainer.appendChild(this.element);
	}

	///  update//move the bullet
	update() {
		const angle = Math.atan2(
			this.enemy.center.y - this.position.y,
			this.enemy.center.x - this.position.x
		);
		const power = 7; /// the speed of the bullet
		this.velocity.x = Math.cos(angle) * power;
		this.velocity.y = Math.sin(angle) * power;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.element.style.left = this.position.x + "px";
		this.element.style.top = this.position.y + "px";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
	}
}
