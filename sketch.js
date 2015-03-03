
// need to add audio from sound cloud too

var nodes = [];
var springs = [];

var tags = [];

var longdistance = 120 ;
var shortdistance = 90;

var selectedNode =null;
var selectedNodeX;
var selectedNodeY;


// custom css for specific type of data : you can add more !
var cssTitle = "font-family: 'Open Sans Condensed', sans-serif; background-color:#000000; color:#FFFFFF; font-size:18pt; padding:10px;text-align: center;";
var cssTags = "font-family: 'Open Sans Condensed', sans-serif; background-color:#000000; color:#FFFFFF; padding:10px;text-align: center;";
var cssParagraph = "font-family:monospace; background-color:#000000; color:#FFFFFF; padding:10px;";
var cssLink = "font-family: 'Open Sans Condensed', sans-serif;; background-color:#000000; color:#FFFFFF; font-size:10pt; padding:10px;";

var t = 0; // for pulsing nodes

// set nodes[0] as homepage, it's used in the index with a setTimeout function
function init(){
  setPage(nodes[0].page);
}

function setup() {
  	
  createCanvas(600, 1080);
  smooth();

  textFont("Open Sans Condensed");

  nodes = [];
  springs = [];
  //0
  nodes.push(new Node((width/2),(height/2),'HOME',true)); // true mean isAnchor (label always displayed)
  nodes[0].setProject("pages/home.csv");
  //1
  nodes.push(new Node(random(width),random(height),'CAT VIDEOS',true));
  addConnection(0,random(longdistance,longdistance+longdistance/2));
  nodes[1].setProject("pages/cat_videos.csv");
  //2
  nodes.push(new Node(random(width),random(height),'PHOTOS',true));
  addConnection(0,random(longdistance,longdistance+longdistance/2));
  nodes[2].setProject("pages/photos.csv");
  //3
  nodes.push(new Node(random(width),random(height),'LINKS',true));
  addConnection(0,random(longdistance,longdistance+longdistance/2));
  nodes[3].setProject("pages/links.csv");
  //4
  nodes.push(new Node(random(width),random(height),'AUDIO',true));
  addConnection(0,random(longdistance,longdistance+longdistance/2));
  nodes[3].setProject("pages/audio.csv");

  selectedNode = nodes[0];
}

function addConnection(index,l){
  springs.push( new Spring(nodes[index], nodes[nodes.length-1],l));
}


function draw() {
  t+=0.1;
  background(0);

  for (var i = 0 ; i < springs.length ; i++){
    springs[i].update();
    springs[i].display();
  }

  for (var i = 0 ; i < nodes.length ; i++){
    nodes[i].update();
    nodes[i].display();

    nodes[i].over(mouseX,mouseY);
    
    for (var j = 0 ; j < nodes.length ; j++){
      if (i!=j) nodes[i].attract(nodes[j]);
    }
  }

  noFill();
  stroke(255);
  ellipse(selectedNode.location.x,selectedNode.location.y,25,25);

}

function mouseDragged(){
  if (selectedNode != null) {    
    selectedNode.location.x = mouseX;
    selectedNode.location.y = mouseY;
  }
}

function mouseMoved() {
  var maxDist = 10; 
  if(mouseX<590){ // stay in our canvas range
    for (var i = 0; i < nodes.length; i++) {
      var d = dist(mouseX, mouseY, nodes[i].location.x, nodes[i].location.y);
      if (d < maxDist && nodes[i].overMe == false) {      
        selectedNode = nodes[i];
        setPage(selectedNode.page); // set the page with a custom parser function      
      }      
    }
  }
}


// parse a csv file to a series of DOM elements
function setPage(project){

  removeElements(); // clean everything

  var row ; // to hold the table row
  var str ; // hold the content of the data column
  var type ; // hold the content of the type column
  var linebreak; // hold the content of the linebreak column
  var posY = -20; // keep track of where we're at building the page
  var posX = 600;

  for (var i = 1 ; i < project.getRowCount(); i++){
    // get the row we're at
    row = project.getRow(i);
    // get it's content
    type = row.getString(0);
    str = row.getString(1); 
    linebreak = row.getString(2);

    // check type and do stuff
    if (type == 'Title'){
      var title = createElement('h1',str); 
      title.style(cssTitle); // apply css
      title.position(posX,posY);

      if (linebreak == 'True' || linebreak == ' True'){
        posY += title.height  ;
        posX = 600;
      } else {
        posX += title.width;
      }
    }

    else if (type == 'Video'){
      var vid = createDiv(str,dummy); // we create a div instead of a video element, because we want to embed the player too
      vid.style(cssTitle);
      vid.position(posX,posY);

      if (linebreak == 'True' || linebreak == ' True'){
        posY += vid.height ;
        posX = 600;
      } else {
        posX += vid.width;
      }
    }

    else if (type == 'Paragraph'){
      var description = createP(str);
      description.style(cssParagraph);
      description.size(720,AUTO);
      description.position(posX,posY);

      if (linebreak == 'True' || linebreak == ' True'){
        posY += description.height ;
        posX = 600;
      } else {
        posX += description.width;
      }
    }

    else if (type == 'Image'){
      var image = createImg(str);
      image.style(cssParagraph);
      image.size(AUTO,200);
      image.position(posX,posY);

      if (linebreak == 'True' || linebreak == ' True'){
        posY += image.height;
        posX = 600;
      } else {
        posX += image.width;
      }
    }

    else if (type == 'Tags'){
      var p = createP(str);
      p.style(cssTags);
      p.size(140,AUTO);
      p.position(posX,posY);
  
      p.mouseOver(check); // a custom listener when we over a tag !

      if (linebreak == 'True' || linebreak == ' True'){
        posY += p.height ;
        posX = 600;
      } else {
        posX += p.width;
      }
    }
    // a small image
    else if (type == 'Icon'){
      var ic = createImg(str);
      ic.size(AUTO,38);
      ic.position(posX,posY);

       if (linebreak == 'True' || linebreak == ' True'){
        posY += ic.height  ;
        posX = 600;
      } else{
        posX += ic.width;
      }
    }
    // jump 25px
    else if (type =='Jump'){
      posY+=25;
    }
    // everything else is a link
    else {
      var link = createA(str,row.getString(0)); // create an anchor element 
      link.style(cssLink);
      link.size(AUTO,18);
      link.position(posX,posY);

      if (linebreak == 'True'|| linebreak == ' True'){
        posY += link.height  ;
        posX = 600;
      } else {
        posX += link.width;
      }
    }
  }
}

// when over a tag we want to check every page in the website
// check it's tags and make it pulse, if a tag is consistent with the element we over
function check(param){

  // get every page
  for (var i = 0 ; i < nodes.length ; i++){
    var checkpage = nodes[i].page;
    nodes[i].highlight = false; // reset every node
    
    // get every row
    for (var j = 0 ; j < checkpage.getRowCount() ; j++){
      var checkrow = checkpage.getRow(j);
      // check the tags
      if(checkrow.getString(0) == 'Tags'){
        // if the content equals the innerHTML of the object passed to the function
        if(checkrow.getString(1) == param.currentTarget.innerHTML){
          nodes[i].highlight = true; // do pulse
        }
      }
    }
  }
}




