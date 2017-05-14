class Car extends Actor {
	constructor(x, y) {
		super(x, y);
		this.radian = 0;
		this.speed = 0;
		this.createFillStyle();
	}

	createFillStyle(imgsrc = null) {
		let ctx = FlexibleView.Instance.ctx;

		this.width = 16;
		this.height = 16;
		this.hW = this.width / 2;
		this.hH = this.height / 2;
		this.fillStyle = 'rgba(200, 200, 255, 0.7)';
		this.img = new Image();
		this.img.onload = ()=> {
			this.width = this.img.width;
			this.height = this.img.height;
			this.hW = this.width / 2;
			this.hH = this.height / 2;
			this.fillStyle = ctx.createPattern(this.img, 'repeat-x');
		};
		if (imgsrc) {
			this.img.src = imgsrc;
		}
	}

	isHit(x, y) {
//		let tx = this.cx - x;
//		let ty = this.cy - y;
//		let rad = -this.radian;
//		let rx = Math.cos(rad) * tx - Math.sin(rad) * ty;
//		let ry = Math.sin(rad) * tx + Math.cos(rad) * ty;
//		let left = -this.length / 2 + this.person.radius;
//		let top = -this.height / 2;
//		let right = this.width + left;
//		let bottom = this.height + top;
//
//		this.hit = left <= rx && rx <= right && top <= ry && ry <= bottom;
//		return this.hit;
		return false;
	}

	calculatePosition() {
		this.x += Math.cos(this.radian) * this.speed / 700;
		this.y += Math.sin(this.radian) * this.speed / 700;

		if (0 < Math.abs(this.speed)) {
			this.speed += 0 < this.speed ? -1 : 1;
		}
	}

	draw(ctx) {
		this.calculatePosition();
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.radian);
		ctx.translate(-this.hW, -this.hH);
		ctx.scale(0.3, 0.3);
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.restore();
	}
}
