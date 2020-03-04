const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 15;
const cellsVertical = 12;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
	element : document.body,
	engine  : engine,
	options : {
		wireframes : false,
		//why can these be written this way (destructure??)
		width,
		height
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 4, {
		isStatic : true
	}),
	Bodies.rectangle(width / 2, height, width, 4, {
		isStatic : true
	}),
	Bodies.rectangle(0, height / 2, 4, height, {
		isStatic : true
	}),
	Bodies.rectangle(width, height / 2, 4, height, {
		isStatic : true
	})
];

World.add(world, walls);

//Maze generation
const shuffle = (arr) => {
	let counter = arr.length;

	while (counter > 1) {
		const index = Math.floor(Math.random() * counter);

		counter--;

		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
};

const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));
const verticals = Array(cellsHorizontal).fill(null).map(() => Array(cellsVertical - 1).fill(false));
const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
	// if have visited the cell at [row, column], return
	if (grid[row][column]) {
		return;
	}
	//Mark this cell as being visited
	grid[row][column] = true;
	//assemble randomly-ordered list of neighbors
	const neighbors = shuffle([
		[
			row - 1,
			column,
			'up'
		],
		[
			row,
			column + 1,
			'right'
		],
		[
			row + 1,
			column,
			'down'
		],
		[
			row,
			column - 1,
			'left'
		]
	]);
	//for each neighbor
	for (let neighbor of neighbors) {
		const [
			nextRow,
			nextColumn,
			direction
		] = neighbor;
		//see if that neighbor is out of bounds
		if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
			continue;
		}
		//if we have visited, continue to next neighbor
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		//remove a wall from either horizontals or verticals
		if (direction == 'left') {
			verticals[row][column - 1] = true;
		}
		else if (direction == 'right') {
			verticals[row][column] = true;
		}
		else if (direction == 'up') {
			horizontals[row - 1][column] = true;
		}
		else if (direction === 'down') {
			horizontals[row][column] = true;
		}
		//visit that cell
		stepThroughCell(nextRow, nextColumn);
	}
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		else {
			const wall = Bodies.rectangle(
				columnIndex * unitLengthX + unitLengthX / 2,
				rowIndex * unitLengthY + unitLengthY,
				unitLengthX + 3,
				4,
				{
					label    : 'wall',
					isStatic : true,
					render   : {
						fillStyle : 'gray'
					}
				}
			);
			World.add(world, wall);
		}
	});
});

verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		else {
			const wall = Bodies.rectangle(
				columnIndex * unitLengthX + unitLengthX,
				rowIndex * unitLengthY + unitLengthY / 2,
				4,
				unitLengthY + 3,
				{
					label    : 'wall',
					isStatic : true,
					render   : {
						fillStyle : 'gray'
					}
				}
			);
			World.add(world, wall);
		}
	});
});

//Configure the goal
const goal = Bodies.rectangle(width - unitLengthX / 2, height - unitLengthY / 2, unitLengthX * 0.7, unitLengthY * 0.7, {
	isStatic : true,
	label    : 'goal',
	render   : {
		fillStyle : 'green'
	}
});
World.add(world, goal);

// Ball

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthX / 2, ballRadius, {
	label  : 'ball',
	render : {
		fillStyle : 'orange'
	}
});

World.add(world, ball);
document.addEventListener('keydown', (event) => {
	const { x, y } = ball.velocity;

	if (event.keyCode === 87) {
		Body.setVelocity(ball, { x, y: y - 5 });
	}

	if (event.keyCode === 68) {
		Body.setVelocity(ball, { x: x + 5, y });
	}

	if (event.keyCode === 83) {
		Body.setVelocity(ball, { x, y: y + 5 });
	}

	if (event.keyCode === 65) {
		Body.setVelocity(ball, { x: x - 5, y });
	}
});

// Win condition

Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		const labels = [
			'ball',
			'goal'
		];
		if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
				}
			});
			document.querySelector('.winner').classList.remove('hidden');
		}
	});
});
