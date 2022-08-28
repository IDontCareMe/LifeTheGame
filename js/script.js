(() => {
	const VERSION = "0.0a";
	const font = "20px 'Comic Sans MS'";
	const CREATE = 0;
	const RUN = 1;

	const cellSize = 10;
	const canvas = document.querySelector("canvas");
	let width = canvas.width = window.innerWidth;
	let height =canvas.height = window.innerHeight;

	const ctx = canvas.getContext("2d");

	let col = Math.ceil(height/cellSize);
	let row = Math.ceil(width/cellSize);
	let amount = col * row;

	let gameMode = CREATE;

	let mouse = {
		x: undefined,
		y: undefined
	}

	function Cell(x, y) {
		this.x = x;
		this.y = y;
		this.alive = false;
		this.nextTurnAlive = false;

		this.draw = function() {
			ctx.strokeStyle = "#EEE";
			ctx.fillStyle = "#333";
			ctx.beginPath();
			ctx.rect(this.x, this.y, cellSize, cellSize);
			ctx.closePath();
			if (this.alive) {
				ctx.fill();
			}
			ctx.stroke();
		}

		this.update = function(pos) {
			let neiborhoodAmount = 0;
			this.nextTurnAlive = false;

			// Check that we have space left of cell and top and right and bottom and than we count all neiborhood
			// Left-top
			if (pos >= col && pos%col > 0) { if (cells[pos - col - 1].alive) neiborhoodAmount++}
			// Left
			if (pos >= col){ if (cells[pos - col].alive) neiborhoodAmount++}
			// Left-bottom
			if (pos >= col && pos%col < col - 1) { if (cells[pos - col + 1].alive) neiborhoodAmount++}
			// Top
			if (pos%col > 0) { if (cells[pos - 1].alive) neiborhoodAmount++}
			// Bottom
			if (pos%col < col - 1) { if (cells[pos + 1].alive) neiborhoodAmount++}
			// Right-top
			if (pos < amount - col && pos%col > 0) { if (cells[pos + col - 1].alive) neiborhoodAmount++}
			// Right
			if (pos < amount - col) { if (cells[pos + col].alive) neiborhoodAmount++}
			// Right-bottom
			if (pos < amount - col && pos%col < col - 1) { if (cells[pos + col + 1].alive) neiborhoodAmount++}	

			// If cell is alive
			if (this.alive) {
				if (neiborhoodAmount >=2 && neiborhoodAmount <= 3) {this.nextTurnAlive = true}
			} else {
				if (neiborhoodAmount == 3) {this.nextTurnAlive = true}
			}
		}
	}

	// HelpMenu class
	class HelpMenu {
		constructor(x, y, width, height, bgColor, font, fontColor) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.bgColor = bgColor;
			this.font = font;
			this.fontColor = fontColor;
			this.show = true;
		}

		draw() {
			// draw rect
			ctx.fillStyle = this.bgColor;
			ctx.fillRect(this.x, this.y, this.width, this.height);
			// draw text
			ctx.fillStyle = this.fontColor;
			ctx.strokeStyle = this.fontColor;
			ctx.font = this.font;
			ctx.fillText("Hot keys: ", this.x + 10, this.y + 20);
			ctx.moveTo(this.x + 10, this.y + 30);
			ctx.lineTo(this.x + this.width - 10, this.y + 30);
			ctx.stroke();
			ctx.fillText("-Run the game/creative mode: 'SPACE BAR'", this.x + 10, this.y + 50);
			ctx.fillText("-Clear world: 'c' (works only in creative mode)", this.x + 10, this.y + 80);
			ctx.fillText("-Show/Hide help menu (this menu): 'h'", this.x + 10, this.y + 110);
			ctx.fillText("-Show/Hide version label: 'v'", this.x + 10, this.y + 140);
			ctx.fillText("Version: " + version.version, this.x + this.width - 130, this.y + this.height - 10);
		}
	}

	// Version label class
	class VersionLabel {
		constructor(x, y, version, font, fontColor) {
			this.x = x;
			this.y = y;
			this.version = version;
			this.font = font;
			this.fontColor = fontColor;
			this.show = false;
		}

		draw() {
			ctx.fillStyle = this.fontColor;
			ctx.font = this.font;
			ctx.fillText("Version: " + this.version, this.x, this.y);
		}
	}

	// Create cells
	let cells = [];
	for(let i = 0; i < width/cellSize; i++) {
		for(let j = 0; j < height/cellSize; j++){
			let x = i * cellSize;
			let y = j * cellSize;
			cells.push(new Cell(x, y));
		}
	}

	// Create helpMenu object
	let helpMenu = new HelpMenu(
								Math.floor(width * 0.1),
								Math.floor(height * 0.1),
								Math.floor(width * 0.8),
								Math.floor(height * 0.8),
								"rgba(120, 142, 158, 0.8)",
								font,
								"#EEE"
								);

	// Create version label
	let version = new VersionLabel(
									width - 130,
									height - 10,
									VERSION,
									font,
									"#788E9E"
									);

	// clearScreen function clears screen by filling it with specific color
	function clearScreen() {
		if (gameMode == RUN) {
			ctx.fillStyle = "#FFC9C9";
		} else {
			ctx.fillStyle = "#B6CB8B";
		}
		ctx.fillRect(0, 0, width, height);
	}

	// clearWorld functions kill all cells. It works only in creative mode(green field)
	function clearWorld() {
		cells.forEach(i => {
			i.alive = false;
		});
	}

	function loop() {
		clearScreen();
		for(let i = 0; i < cells.length; i++) {
			cells[i].draw();
		}

		cells.forEach((i, pos) => {
			i.update(pos);
		});
		if (gameMode == RUN) {
			cells.forEach(i => {
				i.alive = false;
				if (i.nextTurnAlive) { i.alive = true}
			});
		}; 
		
		// draw version
		if(version.show) {
			version.draw();
		}

		// draw help menu
		if(helpMenu.show) {
			helpMenu.draw();
		}
		window.requestAnimationFrame(loop);
	}
	
	// Mouse click
	canvas.addEventListener("click", onClickHandler);
	function onClickHandler(e) {
		let x = e.pageX - e.pageX%cellSize;
		let y = e.pageY - e.pageY%cellSize;

		let i = x/cellSize * col + y/cellSize;

		cells[i].alive = !cells[i].alive;

		mouse.x = x;
		mouse.y = y;
	}

	// Keyboard Key down
	document.addEventListener("keydown", onKeyDown);
	// Key down handler
	function onKeyDown(e) {
		switch (e.code){
			// Run/create mode
			case 'Space': if(gameMode == CREATE) {
								gameMode = RUN;
								document.title = "RUN mode";
								//button pressed
							} else if (gameMode == RUN) {
								gameMode = CREATE;
								document.title = "CREATIVE mode";
								//button unpressed
							}
							break;
			// Show/hide version
			case 'KeyV': 	version.show = !version.show;
							break;
			// Show/hide help menu
			case 'KeyH': 	helpMenu.show = !helpMenu.show;
							break;
			// Clear world
			case 'KeyC': 	if(gameMode == CREATE) {
								clearWorld();
							}
							break;
		}
	}

	loop();	
})();
