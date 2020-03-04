
var numSquares = 6;
var colors = generateColors(numSquares);

var squares = document.querySelectorAll(".square");
var pickedColor = chooseColor();
var colorDisplay = document.querySelector("#goal");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var easyBtn = document.querySelector("#easyBtn");
var hardBtn = document.querySelector("#hardBtn");
var crazyBtn = document.querySelector("#crazyBtn");

for (var i = 0; i < squares.length; i++){
	if (colors[i]){
		squares[i].style.backgroundColor = colors[i];
		squares[i].style.display = "block";
	}
	else{
			squares[i].style.display = "none"; 
	}
}

easyBtn.addEventListener("click", function(){
	easyBtn.classList.add("selected");
	hardBtn.classList.remove("selected");
	crazyBtn.classList.remove("selected");
	//generate three random colors
	numSquares = 3;
	colors = generateColors(3);

	//pick one color
	pickedColor = chooseColor();
	colorDisplay.textContent = pickedColor;
	//change the colors of the first three squrares

	//add event listeners

	//hide the other squres 
	for (var i = 0; i < squares.length; i++){
		if (colors[i]){
			squares[i].style.backgroundColor = colors[i];
		}
		else {
			squares[i].style.display = "none"; 
		}
	}
})

hardBtn.addEventListener("click", function(){
	hardBtn.classList.add("selected");
	easyBtn.classList.remove("selected");
	crazyBtn.classList.remove("selected");
	//generate six random colors
	numSquares = 6;
	colors = generateColors(numSquares);

	//pick one color
	pickedColor = chooseColor();
	colorDisplay.textContent = pickedColor;
	//change the colors of the first three squrares


	//hide the other squres 
	for (var i = 0; i < squares.length; i++){
		if (colors[i]){
			squares[i].style.backgroundColor = colors[i];
			squares[i].style.display = "block";
		}
		else{
			squares[i].style.display = "none"; 
		}
	}
})

crazyBtn.addEventListener("click", function(){
	hardBtn.classList.remove("selected");
	easyBtn.classList.remove("selected");
	crazyBtn.classList.add("selected");
	//generate nine random colors
	numSquares = 9;
	colors = generateColors(numSquares);

	//pick one color
	pickedColor = chooseColor();
	colorDisplay.textContent = pickedColor;
	//change the colors of the first three squrares


	//hide the other squres 
	for (var i = 0; i < squares.length; i++){
		
			squares[i].style.backgroundColor = colors[i];
			squares[i].style.display = "block";
		
	}
})




resetButton.addEventListener("click", function(){
	//generate new colors
	colors = generateColors(numSquares);
	//pick new random color
	pickedColor = chooseColor();
	//change colorDisplay to match picked color
	colorDisplay.textContent = pickedColor;
	//change colors of squares 
	for (var i = 0; i < squares.length; i++){
		squares[i].style.backgroundColor = colors[i];
	}
	h1.style.backgroundColor = "steelblue";
	this.textContent = "New Colors";
	messageDisplay.textContent = ""
})
colorDisplay.textContent = pickedColor; 

for (var i = 0; i < squares.length; i++){
	//add initial colors to squares
	squares[i].style.backgroundColor = colors[i];

	//add click listeners to squares
	squares[i].addEventListener("click", function(){
		//grab color of the clicked square
		var choice = this.style.backgroundColor;
		
		//compare color to picked color
		if (choice == pickedColor){
			messageDisplay.textContent = "Correct!";
			changeColors(pickedColor);
			h1.style.backgroundColor = pickedColor;
			resetButton.textContent = "Play again?"
		}
		else {this.style.backgroundColor = "#232323";
				messageDisplay.textContent = "Try Again!";}
	})
}

function changeColors (color){
	//loop through all squares
	for (var i = 0; i < squares.length; i++) {
	//	change each color
	squares[i].style.backgroundColor = color;
	}
}

function pickColor (){
	var red = Math.floor(Math.random() * 256);
	var green = Math.floor(Math.random() * 256);
	var blue = Math.floor(Math.random() * 256);
	return ("rgb(" + red + ", " + green + ", " + blue + ")" )
}

function chooseColor (){
	var random = Math.floor(Math.random() * colors.length);
	console.log(random);
	return colors[random];
}

function generateColors(num){
	// make an array
	var arr = [];
	// add num random colors to arr
	for (var i = 0; i < num; i++){
		arr.push(pickColor());
	}
	// return the array
	return arr;
}