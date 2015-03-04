# Alagae-DOM with p5.js
______________________________

First if you want to have an example of what it looks like you can check my github.io page :


This repo exhibits a simple example to be able to build a website using p5.js and p5.dom libraries.
http://p5js.org/
http://p5js.org/download/
http://p5js.org/reference/#/libraries/p5.dom


# How does it work ?

On the right hanside of the page you have a canvas showing a map of nodes. Each node should be seen as a category, or a page. We bind each node to a csv file, this csv file contains the content of your page, when you over a node in the left part of the screen : DOM elements will be created in the right side of your page according to your specifications.

A nice feature is the tag system : when you over a tag, other pages that contains the same tag begin to pulse, but we will talk about it later.

you can check it out there : http://b2renger.github.io/

The code in this repo is a website about cats & unicorns, I know you love it.

To run it you'll need to run a server on your machine such as : http://www.pythonforbeginners.com/modules-in-python/how-to-use-simplehttpserver/




# How to write a csv file ?
To write a csv file you need to start with a header :

```
type, data, linebreak,
```
Then for each element you want to add you need to add the type (Paragraph, Video, Image ...), the data (link, code, text ...), and specify if you want to create next element below (you must write True in the linebreak column), or next to, the previous one.



For instance if you want to create a title for your page you can write :

```
Title, My very cool website,True,

```

Then you just need to save it as a csv file, in the page folder.


# How to add a node to my map ?

You'll need to add a few lines of code to the sketch.js file in order to do that.

First look for the setup function :
```javascript
function setup() {
...
}

```

This will initiate our map and nodes. 

First : to add a node you need to pass four arguments : its coordinates (x and y values), its name (as a string), and a boolean.This last parameter enables to differentiate 'anchor nodes' from 'non anchor nodes', this just means that 'anchor nodes' will always have their label (with their Names) displayed.

Second : you need to link the node to a csv file by calling the setProject() method on this node, it just needs to be given the path to the rightfull csv file.

Third : you need to link the node create on the canvas to other nodes by calling the addConnection() method. You need to pass the id of the node, and the length of the connection.


``` javascript
nodes.push(new Node((width/2),(height/2),'My New Category',true)); // create.
nodes[nodes.length-1].setProject("pages/new-category.csv"); // link to csv.
nodes[nodes.length-1].addConnection(0,150); // link to other nodes. 0 is home
```


# Add elements API to help you write csv files
## Add a title
```
Title, My very cool website,True,

```
## Add an image
```
Image, link to my image,True,

```
## Add a paragraph
```
Paragraph, my text ... (no comas in there !),True,

```
## Add a jump
```
Jump, , ,

```
## Add a video
```
Video, copy and paste embed code from youtube or vimeo,True,

```
## Add an audio file
```
Audio, copy and paste embed code from soundcloud,True,

```
## Add an icon
```
Icon, link to your icon,True,

```
## Add a tag
```
Tags, #yourTag,True,

```
## Add a link
```
Name of the link, link,True,

```

# The code ?

If you want to dive in it you'll need to know a bit about how processing works. I won't go deep in he processing code but rather explain the DOM parts.

The **sketch.js** is where you want to start. *c_nodes.js* and *c_springs.js* are javascript classes to handle the physics, they are adapted from http://www.generative-gestaltung.de/M_6_1_03

So nothing to declare before the use of the setPage() method in the mouseMoved() function :
```javascript
function mouseMoved() {
   ...
   setPage(selectedNode.page); // set the page with a custom parser function      
   ...
}
```

so when we are over a node we call a custom function, this function will take the csv file from the selectedNode and parse it to DOM elements.

```javascript
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
      var title = createElement('h1',str); // create the corresponding element
      title.style(cssTitle); // apply custom css
      title.position(posX,posY); // move to position

      // set next position accorgin to linebeak
      if (linebreak == 'True' || linebreak == ' True'){
        posY += title.height  ;
        posX = 600;
      } else {
        posX += title.width;
      }
    }
    // next case ...
    ...

}

```
Our for loop will make us iterate through every element of our csv file, and everything that doesn't fit one of the tests on the type will be a link !


# And what about this tag system mentionned earlier ?

Right ! Just to add more fun, in the setPage() method we add a little twist when it comes to tags

```javascript
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
``` 

Yes right in the middle we have :
```javascript
 p.mouseOver(check); // a custom listener when we over a tag !
```

This is how we add a listener to an element in js. So each time an element created with type 'Tags' is overed by the user it will call the check function.

So we need to check all the nodes we have and all the pages, we also need to inspect every row of every csv files to check the tags, and if we find the same tag, we change something to our node. This means two for loops in a row.

Notice the 'param' at the declaration of the check() function, this means that we can get access to the event passed when the function is called. This is in fact a mouseEvent, but you can get its target using **.curentTarget** and its target's html content **.innerHTML**. So by calling **param.currentTarget.innerHTML** i managed to get a String which is the tag we are looking for.


```javascript
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
```

So when we find an element we set the higlight mode on.























