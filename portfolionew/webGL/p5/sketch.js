// var s = function(sketch) {


//  =================================================================
//====COLORS

//  Color selection
//See here if full array wanted: https://gist.github.com/bobspace/2712980

//-------------------------------------
////  rgba:
let red = 'rgba(255, 0, 0, 0.8)',
    blue = 'rgba(0, 0, 255, 0.8)',
    cyan = 'rgba(0, 255, 255, 0.8)',
    green = 'rgba(0, 128, 0, 0.8)',
    yellow = 'rgba(255, 255, 0, 0.8)',
    goldwhite1 = 'rgba(244, 235, 122, 0.74)',
    gold1 = 'rgba(240, 206, 93, 0.62)',
    brown1 = 'rgba(219, 141, 52, 0.38)',
    lime = 'rgba(0, 255, 0, 0.8)',
    fuchsia = 'rgba(255, 0, 255, 0.8)',
    orange = 'rgba(255, 165, 0, 0.8)',
    chartreuse = 'rgba(127, 255, 0, 0.8)',
    deeppink = 'rgba(255, 20, 147, 0.8)',
    dodgerblue = 'rgba(30, 144, 255, 0.8)',
    white = 'rgba(255, 255, 255, 0.8)',
    greenyellow = 'rgba(173, 255, 47, 0.8)';

//use myColors2 array for alpha
// let myColors2 = [red, blue, cyan, yellow, lime, fuchsia, orange, chartreuse, deeppink, white, greenyellow];

// without alpha
var myColors2 = [gold1, gold1, gold1, goldwhite1, brown1, brown1, brown1, brown1, brown1, brown1];
let storeColors = myColors2.slice(); // slice creates copy

//-------------------------------------
function getARandomColor() {

    /*  a value between 0 and color.length-1
    // Math.round = rounded value
    // Math.random() a value between 0 and 1 */
    var colorIndex = Math.round((myColors2.length - 1) * Math.random());
    var c = myColors2[colorIndex];

    if (colorIndex > -1) { // avoid repeating a color
        myColors2.splice(colorIndex, 1);

        //  if array is at end
        if (myColors2.length === 0)
            myColors2 = storeColors.slice(); // make a copy
    }

    //     var c = colors[5];// specific color
    //     var c = 'rgba(240, 215, 113, 0.43)';

    // return the random color
    return c;
}











//  ===========================================================
//====ATTRACTOR

//====CONSTRUCTOR
class Attractor {
    //(number, number, number, number, color)
    constructor(x, y, mass, gravity, color) {

        //  Mass and gravity work together. I am setting gravity to a constant and using mass as the only decisive factor. Gravity and mass are only used to calculate attraction() for calculations, mass is used also in display() and update()
        this.mass = mass;
        this.initialMass = mass; // a scalar reference, a constant
        // this.grav = _gravity;//not used at the moment
        this.rAcc = 2; // limits of acceleration(random rAcc,random -rAcc) - good for control
        this.rVel = 7; // limits of random velocity

        //vectors
        this.pos = createVector(x, y);
        this.acc = createVector(random(-this.rAcc, this.rAcc), random(-this.rAcc, this.rAcc));
        this.vel = createVector(random(-this.rVel, this.rVel), random(-this.rVel, this.rVel));

        //util-floats
        this.count = 0; // counts for the shifts in direction in update// 
        this.counterShift = random(30, 60);

        this.color = color; //color
    }
}

//-------------------------------------
//====ATTRACTOR STATIC PROPERTIES
//time elapsed since last frame. We are equalling 60 frames per second, to ms. whenever time is polled it will be equivalent to (60 * vel * elapsed), elapsed being equal to (newTime - oldTime )/ 1000 (approx 16.6ms , which is 60fps)
Attractor.elapsed = 1;
Attractor.scalM = 1; // scalar for size of eclipse() / only display at the moment
Attractor.nbAtrctr = 1; //Attractor.numberOfAttractors = 0;
Attractor.arr = [];

//  -----------------------------------
//====ATTRACTOR METHODS
Attractor.prototype.calculateAttraction = function (p) { //(type: particle)
    // generates a force, returns vector force = (x,y);

    // Calculate direction of force
    p.force = p5.Vector.sub(this.pos, p.pos); //2d vector

    // Distance between objects
    // get the lenght (magnitude) of the vector
    let distance = p.force.mag(); //2d vector / see footnote

    // Artificial constraint
    distance = constrain(distance, 2, 8); //constrain(n,low,high) n=numberToConstrain

    // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    p.force.normalize();

    // Calculate gravitional force magnitude
    let strength = (this.mass * p.mass) / (distance * distance);
    // var strength = (this.grav * this.mass * part.mass) / (distance * distance);
    // Get force vector --> magnitude * direction
    p.force.mult(strength);
    // this.calculatedthis.force = this.force;
    // p.force = force;
}

//  --------------------------------------------------------
Attractor.prototype.update = function () {

    // this counter decides when to do a shift in direction
    if (this.count >= this.counterShift - 1) {
        this.acc = createVector(random(-this.rAcc, this.rAcc), random(-this.rAcc, this.rAcc));
        this.counterShift = random(15, 240); //defines how many counts until next shift
    }

    this.vel.add(this.acc); // add acceleration to velocity

    //constrains a value between a minimum and a maximum value/ I guess limit and constrain have the same use here
    // this.vel.x = constrain(this.vel.x, -this.rAcc, this.rAcc);// constrain so that is does not go crazy fast
    // this.vel.y = constrain(this.vel.y, -this.rAcc, this.rAcc);

    //this seems to work best
    this.vel.limit(this.rAcc); //limited by maximum size of acceleration
    // console.log(this.vel.x.toFixed(1) + ' ' + this.vel.y.toFixed(1));


    let storeVel = p5.Vector.mult(this.vel, Attractor.elapsed);

    //    this.pos.add(storeVel);
    this.pos = createVector(mouseX, mouseY);
    this.acc.mult(0); //  we reset to 0,0

    this.count++;
    this.count = this.count % this.counterShift;
};

//  --------------------------------------------------------
Attractor.prototype.displayIt = function () {
    ellipseMode(CENTER);
    strokeWeight(0);
    stroke(0);
    fill('rgb(252, 0, 0)');
    //    ellipse(this.pos.x, this.pos.y, this.mass * Attractor.scalM, this.mass * Attractor.scalM);
    if (lstnrs.toggle1) { //this lstnr as class property 
        ellipse(this.pos.x, this.pos.y, this.mass * Attractor.scalM, this.mass * Attractor.scalM);
    }
}
//  --------------------------------------------------------
Attractor.prototype.edges = function () {
    //  used for attractor, could also be used for particle
    //  needs improving - put object at collision point
    //maybe use radius for limit
    if ((this.pos.y + this.mass) > g.myHeight * 2 / 3) {
        this.vel.y *= -1;
        this.pos.y = g.myHeight * 2 / 3 - this.mass;
    }

    if ((this.pos.y - this.mass) < g.myHeight / 3) {
        this.vel.y *= -1;
        this.pos.y = g.myHeight / 3 + this.mass;
    }

    if ((this.pos.x + this.mass) > g.myWidth * 2 / 3) {
        this.vel.x *= -1;
        this.pos.x = g.myWidth * 2 / 3 - this.mass;
    }

    if ((this.pos.x - this.mass) < g.myWidth / 3) {
        this.vel.x *= -1;
        this.pos.x = g.myWidth / 3 + this.mass;
    }
}










//  ===========================================================
//====PARTICLE

//====CONSTRUCTOR
class Particle {

    constructor(xStart, yStart, color) { //(number, number, color)

        //  vectors
        this.pos = createVector(xStart, yStart);
        this.vel = createVector(0.0, 0);
        this.acc = createVector(0.0, 0);
        this.force = createVector(1, 1);

        //floats
        this.mass = random(3, 7); //3-10
        this.initialMass = this.mass; // constant scalar reference
        this.limit = random(3, 7); //limits velocity - limits the distance - great to control
        // this.limit = 5;//limits velocity

        //color
        //        this.color = color;// could be static since I am using the same for all
        this.color = getARandomColor();
        //        console.log(this.color);
    }
}

//-------------------------------------
//====PARTICLE STATIC PROPERTIES
Particle.scalM = 1; //scale mass / only display, not calculations
Particle.elapsed = 1;
Particle.nbPtcls = 0; //Particle in each array of particles;
Particle.arr = []; // Particle.arr = [ [],[],[], ... ]

//  -----------------------------------
//====PARTICLE METHODS
Particle.prototype.applyForce = function () {
    this.force.div(this.mass);
    this.acc.add(this.force);
}

//  -----------------------------------
Particle.prototype.update = function () {

    this.vel.add(this.acc);
    this.vel.limit(this.limit);
    let storeVel2 = p5.Vector.mult(this.vel, Particle.elapsed);
    this.pos.add(storeVel2);
    this.acc.mult(0); // here multiplied by 0 in order to reset to (0,0)
}

//  -----------------------------------
Particle.prototype.display = function () {
    stroke(0);
    strokeWeight(0);
    // fill(255, 127);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.mass *
        Particle.scalM, this.mass * Particle.scalM);
}

Particle.prototype.join = function () {
    for (let i = 0; i < Attractor.nbAtrctr; ++i) {
        Particle.arr[i].forEach(element => {
            let dis = dist(this.pos.x, this.pos.y, element.pos.x, element.pos.y);
            if (dis < g.myWidth / 7) {
                stroke('rgba(201, 173, 57, 0.17)');
                strokeWeight(1);
                line(this.pos.x, this.pos.y, element.pos.x, element.pos.y);
            }
            //            console.log(dis);
        });
    }
}










//  ===========================================================

//====LISTENERS
let lstnrs = {}; // an object for the listeners' values
lstnrs.toggle1 = false;

//used together, but listener changes one at a timeß
lstnrs.pLimitLo = 7;
lstnrs.pLimitHi = 10;

//====GLOBAL OBJECT
//declare a namespace for global variables
let g = {};

//-------------------------------------
g.deleteUnused = function () {
    // properties to be deleted after they are used in setup
    delete this.attMass;
    delete this.randMass;
    delete this.attGravity;
}













//  ===================================
//====SKETCH - MAIN
g.canvas = {};

Attractor.nbAtrctr = 1; //var numberOfAttractors = 5;
Particle.nbPtcls = 1000; //var particlesPerAttractor = 400;


g.attMass = 3, g.randMass = 1; //  mass + 10.ranodm // 12, 5 is a good setting to start
g.attGravity = 1; // was random(0.5, 1)

//  ---------------
g.word = 0, g.word2 = null;
g.initialTime = new Date();
g.oldTime = new Date(), g.newTime = new Date(); // initialize to date to avoid error on first calculation 

g.myHeight = 0, g.myWidth = 0;

//  -----------------------------------

g.initTime = new Date();
g.runningTime = new Date();

g.totalElapsed = 0;
g.totalFrameRate = 0;
g.countedFrames = 0;
g.countForDisplay = 0;

//------------------------------------
let surface, mask;

function preload() {
    surface = loadImage("surface.png");
    mask = loadImage("mask.png");
}


//  ===================================
//  -----------------------------------
function setup() {
    g.myHeight = document.getElementById('p5js').offsetHeight;
    g.myWidth = document.getElementById('p5js').offsetWidth;

    g.canvas = createCanvas(g.myWidth, g.myHeight);
    g.canvas.parent('p5js');
    frameRate(30);
    createAttractors(Attractor.arr, Particle.arr, g);
    g.deleteUnused();
    lstnrs.addListeners();
}

//  -----------------------------------
function draw() {
    background('#050505');


    //use newTime - meanwhile g.oldTime is the previous newTime, 
    //  after use, store it in g.oldTime
    g.newTime = new Date();

    //time elapsed between frames
    // (1/1000 = 0.001); 0.001 * 60 = 0.06 , a constant; 1000 * 0.06 = 60
    let elapsed = (g.newTime - g.oldTime) * 0.06;

    Attractor.elapsed = elapsed;
    Particle.elapsed = elapsed;

    //    displayStats(g);

    // Attractor attracts particle
    calcAttractors(Attractor.arr, Particle.arr);

    g.oldTime = g.newTime;

    image(surface, g.myWidth / 2 - g.myHeight, 0, g.myHeight * 2, g.myHeight);

    //    console.log(lstnrs.pLimitLo,lstnrs.pLimitHi,gold1);
} //end










//====UTILITIES
//  -----------------------------------
function calcAttractors(attArray, partArray) { //(array, array)
    for (let i = 0; i < Attractor.nbAtrctr; ++i) {
        attArray[i].update();
        attArray[i].edges();
        attArray[i].displayIt();

        calcParticles(i, attArray, partArray);
    }
}

//  -----------------------------------
function calcParticles(i, attArray, partArray) { //(number, array, array)
    for (let j = 0; j < Particle.nbPtcls; ++j) {

        //  calculate attractions is a function of attractor class
        // calculate attraction between particles and attractor
        attArray[i].calculateAttraction(partArray[i][j]);

        //  apply force (attraction) to each particle
        partArray[i][j].applyForce();

        //  update and display
        partArray[i][j].update();
        partArray[i][j].display();
        //        partArray[i][j].join();
    }
}

//  -----------------------------------
function createAttractors(attArray, partArray, g) { //(array, array, object)
    for (let i = 0; i < Attractor.nbAtrctr; ++i) {
        //  create the arrays

        partArray.push([]); // Particle.arr = [ [],[],[], ... ]

        let color = getARandomColor();

        // Attractor (x, y, mass, gravity, color) 10 + random(10)
        attArray[i] = new Attractor(g.myWidth / 2, g.myHeight / 2, g.attMass +
            random(g.randMass), g.attGravity, 'rgba(75,75,75, 0.4)');

        createParticles(i, color, partArray, g);
    }
}

//  -----------------------------------
//(number, color, array, object)
function createParticles(i, color, partArray, g) {
    for (let j = 0; j < Particle.nbPtcls; ++j) {
        partArray[i][j] = new Particle(random(g.myWidth / 2 - g.myHeight, g.myWidth / 2 + g.myHeight), random(g.myHeight), color);
    }
}

//  -----------------------------------
function displayStats(g) { //(object)
    g.countForDisplay %= 10;
    g.countForDisplay++;
    if (g.countForDisplay >= 10) {
        g.word = round(frameRate());
        // word2 = totalElapsed;
    }
    fill(255, 255, 255);
    text("fps: " + g.word, 10, 30);
}









//-------------------------------------
//====LISTENERS
lstnrs.addListeners = function () { // invoked from setup

    //    //	buttons  
    //	let showAtrctr = document.querySelector('#toggleAtt');
    //	showAtrctr.addEventListener('click', toggleButton(lstnrs));
    //
    //	let changeColorsB = document.querySelector('#recolor');
    //	changeColorsB.addEventListener('click', changeColors);
    //	//inputs
    //	let aMassLstnr = document.querySelector('#aMass');
    //	aMassLstnr.addEventListener('input', updateAtrctrM);
    //
    //	let pMassLstnr = document.querySelector('#pMass');
    //	pMassLstnr.addEventListener('input', particleMass);
    //
    //	let pLimitLo = document.querySelector('#pLimitLo');
    //	pLimitLo.addEventListener('input', changeLo(lstnrs));
    //
    //	let pLimitHi = document.querySelector('#pLimitHi');
    //	pLimitHi.addEventListener('input', changeHi(lstnrs));
    //
    //	let myWindow = window.addEventListener('resize', adjustSize);
}

//  ===================================
//====LISTENER'S FUNCTIONS

function changeLo(lstnrs) { //(lstnrs obj)
    return function (evt) {
        lstnrs.pLimitLo = parseFloat(evt.target.value);
        setPLimit(lstnrs);
    }
}

//-------------------------------------
function changeHi(lstnrs) { //(lstnrs obj)
    return function (evt) {
        lstnrs.pLimitHi = parseFloat(evt.target.value);
        setPLimit(lstnrs);
    }
}

//-------------------------------------
function setPLimit(lstnrs) { //sets particle limit / (lstnrs obj)
    for (let i = 0; i < Attractor.nbAtrctr; ++i) {
        for (let j = 0; j < Particle.nbPtcls; ++j) {
            Particle.arr[i][j].limit = random(lstnrs.pLimitLo, lstnrs.pLimitHi);
        }
    }
}

//-------------------------------------
function changeColors() {
    for (let i = 0; i < Attractor.nbAtrctr; ++i) {
        let newColor = getARandomColor();
        // Attractor.arr[i].color = newColor;
        for (let j = 0; j < Particle.nbPtcls; ++j) {
            Particle.arr[i][j].color = newColor;
        }
    }
}

//-------------------------------------
function toggleButton(_lstnrs) { // type: lstnrs
    return function () {
        _lstnrs.toggle1 = !_lstnrs.toggle1;
    }
}

//-------------------------------------
function updateAtrctrM(evt) {
    Attractor.arr.forEach(function (element) {
        element.mass = element.initialMass * evt.target.value; //implicit conversion probably by '*'
    });
}

//-------------------------------------
function particleMass(evt) {
    Particle.scalM = parseFloat(evt.target.value);
}

//-------------------------------------
function adjustSize() {

    g.myWidth = event.target.innerWidth;
    g.myHeight = event.target.innerHeight;
    // canvas.width = myWidth;
    // canvas.height = myHeight;
    resizeCanvas(g.myWidth, g.myHeight - 50);
    // console.log(myWidth + " " + myHeight);
}

//-------------------------------------
function testIt() {
    console.log('test works');
}

// };

// var myp5_1 = new p5(s, 'p5js');