cc.Class({
	extends: cc.Component,
	properties: {

	},
	// use this for initialization
	onLoad() {
		var shareUrl = cc.vv.SI.appweb + "?u=" + cc.vv.userMgr.userId;
		this.init(shareUrl);
	},

	init(url){
		var ctx = this.node.addComponent(cc.Graphics);
		if (typeof (url) !== 'string') {
			console.log('url is not string',url);
			return;
		}
		this.QRCreate(ctx, url);
	},

	QRCreate(ctx, url) {
		// var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
		//var qrcode = new QRCode(-1, QRErrorCorrectLevel.Q);

		var Qrcode = require("qrcode");
		console.log(Qrcode);
       
		var QRErrorCorrectLevel = {
			L : 1,
			M : 0,
			Q : 3,
			H : 2
		};
		var qrcode = new Qrcode(-1, QRErrorCorrectLevel.Q);
		qrcode.addData(url);
		qrcode.make();

		ctx.fillColor = cc.Color.BLACK;
		//块宽高
		var tileW = this.node.width / qrcode.getModuleCount();
		var tileH = this.node.height / qrcode.getModuleCount();

		// draw in the Graphics
		for (var row = 0; row < qrcode.getModuleCount(); row++) {
			for (var col = 0; col < qrcode.getModuleCount(); col++) {
				if (qrcode.isDark(row, col)) {
					// ctx.fillColor = cc.Color.BLACK;
					var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
					var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
					ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
					ctx.fill();
				}
			}
		}
	},

});