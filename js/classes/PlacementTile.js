/** @format */
///// these are the spots that we can place a building

class PlacementTile {
	constructor({ position = { x: 0, y: 0 } }) {
		/// position is an obj
		this.position = position;
		this.width = 64;
		this.height = 64;
		this.size = 64; /// based on tiled map setup
		this.color = ""; //// we make them darker
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

		///if we hover
		if (
			mouse.x > this.position.x &&
			mouse.x < this.position.x + this.size &&
			mouse.y > this.position.y &&
			mouse.y < this.position.y + this.size
		) {
			// color white over hover

			this.color = "rgba(255,255,255)";
		} else this.color = "rgba(255,0,210,0.1)";
	}
}
