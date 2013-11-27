/**
 * Spiral
 * @author Carlos Eugenio Torres
 * @date 17/09/2006
 * @version 0.0.2
 */

// Matrix class
function Matrix(width, height, blockSize, container)
{
	this.width = width;
	this.height = height;
	this.blockSize = blockSize;
	this.blocksPerLine = 0;
	this.blocksPerRow = 0;
	this.separationSize = 2;
	this.colorClear = IE ? "#CCCCCC" : "rgb(204, 204, 204)";
	this.colorFill = IE ? "#FFCC00" : "rgb(255, 204, 0)";
	this.colorCenter = IE ? "#FF0000" : "rgb(255, 0, 0)";
	this.container = container;
	this.blocks = [];
	this.centerX = 0;
	this.centerY = 0;
	this.drawDelay = 0;
	this.doublebuffer = "";
}
Matrix.prototype.create = function()
{   
    // Create main bidimensional array
    this.blocksPerRow = Math.round(this.width / (this.blockSize + this.separationSize));
    this.blocksPerCol = Math.round(this.height / (this.blockSize + this.separationSize));
    for (x = 0; x < this.blocksPerRow; x++)
    {
        this.blocks[x] = []
        for (y = 0; y < this.blocksPerCol; y++)
        {
            this.blocks[x][y] = this.colorClear;
        }
    } 
    
    // Find middle block and paint it
    this.centerX = Math.floor(this.blocksPerRow / 2);
    this.centerY = Math.floor(this.blocksPerCol / 2);
    this.blocks[this.centerX][this.centerY] = this.colorCenter;
   
    // Draw matrix
    this.draw();
}
Matrix.prototype.draw = function()
{
    var matrix = "";
    var row = "";
    
    matrix = "<table id='tbMatrix' cellspacing='"+this.separationSize+"' cellpadding='0' border='0' style='width:"+this.width+"px,height:"+this.height+"px'>"
    
    for (y = 0; y < this.blocksPerCol; y++)
    {
        row = "<tr>";
        for (x = 0; x < this.blocksPerRow; x++)
        {
            row += "<td id='"+x+";"+y+"' onclick='showBlockInfo(this);' title='Click to get block information' style='cursor:pointer; width:"+this.blockSize+";height:"+this.blockSize+";background-color:"+this.blocks[x][y]+"'>&nbsp;</td>";
        }
        row += "</tr>";
        matrix += row;
    } 
    
    matrix += "</table>"
    this.container.innerHTML = matrix;
}
Matrix.prototype.updateBlock = function(block,color)
{
    document.getElementById(block.x+";"+block.y).style.backgroundColor = color;
} 
Matrix.prototype.showBlockInfo = function(block)
{
    var x = block.id.split(";")[0];
    var y = block.id.split(";")[1];
    var msg = "Block coordinates:\nX: " + x + " - Y: " + y + "\n\n";
    var passedOrNot = (block.style.backgroundColor.toLowerCase() == this.colorFill.toLowerCase() || block.style.backgroundColor.toLowerCase() == this.colorCenter.toLowerCase()) ? "passed" : "not passed";
    msg += "The spiral has " + passedOrNot + " by this block.";
    alert(msg);
}
 

// Spiral class
function Spiral(direction) 
{
	this.iteration = 1;
	this.factor1 = 1;
	this.factor2 = 0;
	this.factor4 = 0;
	this.direction = direction;
	this.startDirection = direction;
}
Spiral.UP = 0;
Spiral.RIGHT = 1;
Spiral.DOWN = 2;
Spiral.LEFT = 3;
Spiral.prototype.generate = function(block) 
{
	var dx = 0, dy = 0;
    
    // Check if it's a beginning of a new iteration cicle
    if (this.iteration == 1 || (this.factor2 == 0 && this.iteration == 8 && (this.iteration) % 8 == 0) || (this.iteration >= (8*this.factor1) && (this.iteration) % 8 == 0)) //*(this.factor2)
    {
        // Go up directly
        --dy;
        
        // If iteration greater than 1 increment the factors
        if (this.iteration > 1)
        {
            this.iteration = 0;
            this.factor1 += 1;
            this.factor2 += 2;
            this.factor4 += 4;
        }
    } 
    // If not a new cicle, continue within the current iteration cicle
    else
    {			
        // This is the pattern of the spiral
        // It'll decide what will be the next move based on the current iteration
        if (this.iteration <= (2 + this.factor2)) 
            this.direction = this.startDirection;
        else if (this.iteration == (3 + this.factor2)) 
            this.direction = Spiral.DOWN;
        else if (this.iteration > (4 + this.factor2 + this.factor4/2) && this.iteration < (6 + this.factor2 + this.factor4/2)) 
            this.direction = (this.startDirection == Spiral.RIGHT ? Spiral.LEFT : Spiral.RIGHT);
        else if (this.iteration == (7 + this.factor2 + this.factor4)) 
            this.direction = Spiral.UP;
        
        // After we know the next move, make it real by 
        // either adding or subtracting the specific coordinate
        if (this.direction == Spiral.LEFT) --dx;
		else if (this.direction == Spiral.RIGHT) ++dx;
		else if (this.direction == Spiral.UP) --dy;
		else if (this.direction == Spiral.DOWN) ++dy;
    }	
    
    // Increase the iteration
    this.iteration++;
    
    // Update the coordinates of the block to paint on the matrix
    block.update(dx, dy);	
}
	
// Block class
function Block(x, y) 
{
	this.x = x;
	this.y = y;
}
Block.prototype.update = function(dx, dy) 
{
	this.x += dx;
	this.y += dy;
}

// Util functions

// Check wheather is number	or not	    
function isNumber(a)
{
    return typeof a == 'number' && isFinite(a);
}

// Discover wheather is IE or not
var IE = document.all;
