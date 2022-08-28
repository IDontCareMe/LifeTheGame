(() => {
	const VERSION = "0.0a";
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

	//show/hide flags
	let showVersion = false;
	let showHelpMenu = true;

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

	// Create cells
	let cells = [];
	for(let i = 0; i < width/cellSize; i++) {
		for(let j = 0; j < height/cellSize; j++){
			let x = i * cellSize;
			let y = j * cellSize;
			cells.push(new Cell(x, y));
		}
	}

	function random(min, max) {
		return Math.random() * (max - min) + min;
	}

	// clearScreen function clears screen by filling it with specific color
	function clearScreen() {
		//ctx.clearRect(0, 0, width, height);
		if (gameMode == RUN) {
			ctx.fillStyle = "#FFC9C9";
		} else {
			ctx.fillStyle = "#B6CB8B";
		}
		ctx.fillRect(0, 0, width, height);
	}

	// drawVersion draws current version of game
	function drawVersion(color, x, y) {
		//#788E9E
		ctx.fillStyle = color;
		ctx.font = "20px 'Comic Sans MS'";
		ctx.fillText("Version: " + VERSION, x, y);
	}

	// drawHelpMenu draws menu with tips & hot keys
	function drawHelpMenu() {
		//draw rect
		let menuWidth = Math.floor(width * 0.8);
		let meunHeight = Math.floor(height * 0.8);
		let menuX = Math.floor(width * 0.1);
		let meunY = Math.floor(height * 0.1);
		ctx.fillStyle = "rgba(120, 142, 158, 0.8)";
		ctx.fillRect(menuX, meunY, menuWidth, meunHeight);
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
		} 
		
		// draw version
		if(showVersion) {
			drawVersion("#788E9E", width - 130, height - 10);
		}

		// draw help menu
		if(showHelpMenu) {
			drawHelpMenu();
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
								//button pressed
							} else if (gameMode == RUN) {
								gameMode = CREATE;
								//button unpressed
							}
							break;
			// Show/hide version
			case 'KeyV': 	showVersion = !showVersion;
							break;
			// Show/hide help menu
			case 'KeyH': 	showHelpMenu = !showHelpMenu;
							break;
			// Clear world
			case 'KeyC': 	if(gameMode == CREATE) {
								// call function
								console.log('clear the world!');
							}
							break;
		}
	}

	loop();	
})();
