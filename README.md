# karuselo #

The easiest way to make a carousel

## How it works? ##

It's very simple to implement karuselo in your web page, just include jquery, karuselo.js, animate.css and karuselo.css.
  
  ```html
  <script type="text/javascript" src="lib/jquery210.js"></script>
  <script type="text/javascript" src="lib/karuselo.js"></script>
  <link rel="stylesheet" href="lib/animate.css" />
  <link rel="stylesheet" href="lib/karuselo.css" />
  ```
    
You can download one by one this files or use bower (Using bower will download animate.css and jquery.js bundled into the package, this will be removed and add a dependency in future versions):

  ```
  bower install http://github.com/Sirikon/karuselo.git
  ```
  
Then you are ready to set the 'kr-carousel' class to any div element, create some slides and 'next'/'prev' buttons this way:

  ```html
  <div class="kr-carousel">
    <div class="kr-slide" kr-image="res/photo1.jpg"></div>
    <div class="kr-slide" kr-image="res/photo2.jpg"></div>
    <div class="kr-slide" kr-image="res/photo3.jpg"></div>
    <div class="kr-slide" kr-image="res/photo4.jpg"></div>
    <div class="kr-slide" kr-image="res/photo5.jpg"></div>
    
    <div class="kr-controls">
      <button class="kr-next">Siguiente</button>
      <button class="kr-prev">Anterior</button>
    </div>
  </div>
  ```
	
This will create a carousel with the dimensions you want and where you want.

If you put kr-next and kr-prev buttons into a div.kr-controls, the buttons will be always in the same place over the slides.

**NOTE:** kr-next and kr-prev dont include any CSS styling, write your own CSS for better integration in functionality and design with the webpage.

## Optional attributes ##

**kr-slides-by-page**: Sets the number of slides by page. Min: 1, Max: total slides - 1.

  ```html
  <div class="kr-carousel" kr-slides-by-page="3">
    <!-- This will show a carousel with three slides -->
  </div>
  ```

**kr-anims**: (Only effective when kr-slides-by-page is 1) Sets the classes that will be added to the slides depending the situation, 4 values are inLeft, inRight, outLeft and outRight animations, 2 values are in and out animations.

  
  ```html
  <div class="kr-carousel" kr-anims="bounceInLeft bounceInRight bounceOutLeft bounceOutRight">
    <!-- This will show a carousel bounce animations from animate.css -->
  </div>
  ```
  
## License ##
MIT
