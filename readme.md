# Alagae-DOM with p5.js
______________________________

First if you want to have an example of what it looks like you can check my github.io page :
http://b2renger.github.io/

This repo exhibits a simple example to be able to build a website using p5.js and p5.dom libraries.
http://p5js.org/
http://p5js.org/download/
http://p5js.org/reference/#/libraries/p5.dom


# How does it work ?

On the right hanside of the page you have a canvas showing a map of nodes. Each node should be seen as a category, or a page. We bind each node to a csv file, this csv file contains the content of your page, when you over a node in the left part of the screen : DOM elements will be created in the right side of your page according to your specifications.

A nice feature is the tag system : when you over a tag, other pages that contains the same tag begin to pulse, but we will talk about it later.

Let's check the example :



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
Audio, copy and paste embed code from dropbox,True,

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













