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
  
Then you are ready to set the 'kr-carousel' class to any div element, create some slides, add 'next'/'prev' buttons and buttons for every slide, this way:

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
      <div class="kr-navigation"></div>
    </div>
  </div>
  ```
	
This will create a carousel with the dimensions you want and where you want.

If you put kr-next, kr-prev and div.kr-navigation buttons into a div.kr-controls, the buttons will be always in the same place over the slides and over them.

**NOTE:** kr-next, kr-prev and buttons generated into kr-navigation dont include any CSS styling, write your own CSS for better integration in functionality and design with the webpage. Buttons generated into kr-navigation will have a .active class when the slide it represents is the one showing, use this in your page styling.

## Optional attributes ##

**kr-slides-by-page**: Sets the number of slides by page. Min: 1, Max: total slides. If the value equals total slides, carousel will be disabled and just show all the slides without movement or next/prev actions.

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

**kr-interval**: Number in ms. Time to automatically show the next slide.

  ```html
  <div class="kr-carousel" kr-interval="5000">
    <!-- This will show a carousel with 5 seconds interval -->
  </div>
  ```

## License ##
MIT
