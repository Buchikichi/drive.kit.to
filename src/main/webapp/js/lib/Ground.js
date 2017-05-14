class Ground extends Actor {
	constructor() {
		super(0, 0, -1);
		this.createFillStyle('img/ground.1.1.png');
	}

	createFillStyle(imgsrc = null) {
		let ctx = FlexibleView.Instance.ctx;

		this.width = 16;
		this.height = 16;
		this.fillStyle = 'rgba(200, 200, 255, 0.7)';
		this.img = new Image();
		this.img.onload = ()=> {
			this.width = this.img.width;
			this.height = this.img.height;
			this.hW = this.width / 2;
			this.hH = this.height / 2;
			this.fillStyle = ctx.createPattern(this.img, 'repeat');
		};
		if (imgsrc) {
			this.img.src = imgsrc;
		}
	}

	draw(ctx) {
		let width = this.width * 3;
		let height = this.height * 3;

		ctx.save();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(-this.width, -this.height, width, height);
		ctx.restore();
	}
}
