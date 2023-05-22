/**
 * class Boss extends Enemy {
 * 	// constructor({ position = { x: 0, y: 0 }, enemy }) {
 * 	//   super({ position, imageSrc: 'img/projectile.png' })
 * 	//   this.velocity = {
 * 	//     x: 0,
 * 	//     y: 0
 * 	//   }
 * 	//   this.enemy = enemy
 * 	//   this.radius = 10
 * 	// }
 *
 * 	constructor({ health, bounty, position = { x: 0, y: 0 } }) {
 * 		super({ position });
 * 		this.velocity = {
 * 			x: 0,
 * 			y: 0,
 * 		};
 * 		this.health = health;
 * 		this.bounty = bounty;
 * 		this.radius = 70;
 * 	}
 *
 * 	draw() {
 * 		super.draw(); //// talking draw from the enemies
 * 		c.fillStyle = "pink";
 * 	}
 * }
 *
 * @format
 */
