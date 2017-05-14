document.addEventListener('DOMContentLoaded', ()=> {
	let app = new AppMain();
	let activate = ()=> {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		app.draw();
		requestAnimationFrame(activate);
	};

	activate();
});

class AppMain {
	constructor() {
		this.controller = new Controller();
		this.field = new Field(1024, 768);
		this.setupEvents();
		this.init();
	}

	setupEvents() {
		let view = document.getElementById('view');

	}

	init() {
		let car = new OrdinaryCar(2500, 160);

		this.field.addActor(new Ground());
		this.field.addActor(car);
		this.field.addActor(new FastCar(2550, 160));
		this.field.addActor(new HeavyCar(2600, 160));
		this.field.focus = car;
	}

	draw() {
		this.field.draw();
	}
}
