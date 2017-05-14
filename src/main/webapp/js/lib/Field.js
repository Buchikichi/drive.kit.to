/**
 * Field.
 */
class Field {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.hW = this.width / 2;
		this.hH = this.height / 2;
		this.scale = 4;
		this.view = new FlexibleView(width, height);
		this.tx = 0;
		this.ty = 0;
		this.actorList = [];
		this.carIx = 0;
		this.carList = [];
		this.groundList = [];
		this.focus = null;
		this.targetList = [];
		this.dirty = false;
		this.setupEvents();
		Field.Instance = this;
	}

	setupEvents() {
		let view = this.view.view;
		let keys = Controller.Instance.keys;

		view.addEventListener('mousedown', e => {
			let pt = this.view.convert(e.clientX, e.clientY);
			let target = this.scan(pt.x, pt.y);
			let ctrlKey = keys['Control'] || keys['Shift'] || keys['k16'] || keys['k17'];

			if (!ctrlKey) {
				this.targetList = [];
			}
			if (target instanceof ActorHandle) {
				this.hold = target;
			}
		});
		view.addEventListener('mouseup', e => {
			this.dirty = true;
			this.hold = null;
		});
		view.addEventListener('mousemove', e => {
			let pt = this.view.convert(e.clientX, e.clientY);

//console.log(e);
			if (this.hold) {
				let px = pt.x - this.tx;
				let py = pt.y - this.ty;
				this.hold.x = px;
				this.hold.y = py;
				return;
			}
			this.scan(pt.x, pt.y);
		});
	}

	addActor(...actors) {
		actors.forEach(act => {
			this.actorList.push(act);
			if (act instanceof Car) {
				this.carList.push(act);
			}
			if (act instanceof Ground) {
				this.groundList.push(act);
			}
		});
		this.dirty = true;
	}

	scan(x, y) {
		let result = null;
		let px = x - this.tx;
		let py = y - this.ty;

		this.actorList.forEach(actor => {
			actor.hit = false;
			if (result) {
				return;
			}
			if (actor.isHit(px, py)) {
				result = actor;
			}
		});
		return result;
	}

	clearSelection() {
		this.scan(Number.MAX_VALUE, Number.MAX_VALUE);
		this.targetList = [];
	}

	calculatePosition() {
		let keys = Controller.Instance.keys;

		if (keys['PageUp']) {
			this.scale += .1;
			if (8 < this.scale) {
				this.scale = 8;
			}
		} else if (keys['PageDown']) {
			this.scale -= .1;
			if (this.scale < 0.4) {
				this.scale = 0.4;
			}
		}
		if (keys['c']) {
			let ix = this.carList.indexOf(this.focus);

			ix = (ix + 1) % this.carList.length;
			this.focus = this.carList[ix];
			delete keys['c'];
		}
		let car = this.focus;
		let step = Math.PI * .006;

		if (keys['ArrowLeft'] || keys['Left'] || keys['k37']) {
			car.radian -= step;
		} else if (keys['ArrowRight'] || keys['Right'] || keys['k39']) {
			car.radian += step;
		}
		if (keys['ArrowUp'] || keys['Up'] || keys['k38']
				|| keys['Control'] || keys['Shift'] || keys['k16'] || keys['k17']) {
			car.speed += 10;
		} else if (keys['ArrowDown'] || keys['Down'] || keys['k40']) {
			car.speed -= 10;
		}
//		if (this.x < 0) {
//			this.x += this.width;
//		} else if (this.width <= this.x) {
//			this.x -= this.width;
//		}
//		if (this.y < 0) {
//			this.y += this.height;
//		} else if (this.height <= this.y) {
//			this.y -= this.height;
//		}
		this.groundList.forEach(ground => {
			ground.x = car.x;
			ground.y = car.y;
		});
	}

	choiceActor() {
		let list = [];

		this.actorList.forEach(actor => {
			if (!actor.isGone) {
				list.push(actor);
				actor.spawn.forEach(roe => {
					list.push(roe);
				});
			}
		});
		list.sort((a, b) => {
			return a.z - b.z;
		});
		if (this.actorList.length != list.length) {
			this.actorList = list;
			this.dirty = true;
		}
	}

	draw() {
		let ctx = this.view.ctx;
		let car = this.focus;

		this.view.clear();
		this.calculatePosition();
		this.choiceActor();
		ctx.save();
		ctx.font = "12px 'Times New Roman'";
		ctx.textBaseline = 'middle';
		ctx.translate(this.hW, this.hH * 1.5);
		ctx.scale(this.scale, this.scale);
		ctx.rotate(-car.radian - Math.PI / 2);
		ctx.translate(-car.x, -car.y);
		this.actorList.forEach(actor => {
			actor.selected = this.targetList.indexOf(actor) != -1;
			actor.draw(ctx);
		});
		ctx.restore();
	}
}
