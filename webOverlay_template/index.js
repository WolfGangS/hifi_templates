//This script is a simple example of a High Fidelity interface script that has a webOverlayWindow, for user ui.
//We will create the overlay
//Add a button to the tablet
//Link the button to our script so we know when it was clicked
//use that event to open and close our overlay
//and connect the overlay to our script so taht they can talk to each other and share data.


//Deine out Scope
(function() {
  
  //////////////////////////////
  /////////// Overlay //////////
  //////////////////////////////
  
  var overlayHTML = "html/index.html";
  var overlayName = "Example Overlay";
  
  //Some default parameters for out webOverlay
  var overlayProps = {
    title: overlayName,  //A name for our weboverlay
    source: Script.resolvePath(overlayHTML), //The html page that we want to load in the overlay
    width: 400, //width of the overlay (note this is without the borders)
    height: 800, //height of the overla (again, doesn not include borders)
    visible: false, //whether out overlay is visible/open
  };
  
  //Create our web overlay. (it will be created with the parameters defined above.
  //It will not appear to the user, as we are creating it with visible set to false
  var webOverlay = new OverlayWebWindow(overlayProps);
  
  //Connect to the WebEventBridge, the function webEvent will now be called if our overlay sends any events
  webOverlay.webEventReceived.connect(webEvent);
  function webEvent(msg){
    console.info("WebEvent Recieved: " + msg);
    //The overlaysScript is designed to send data as json strings, so we need to parse it back into an object to use it.
    msg = JSON.parse(msg);
    //Do something with the data we have been sent.
  }
  
  //This is a function to send data to our webOverlay,
  //essentially the counterpart to the previous method where the overlay sends data to this script
  // Here we use a type and data, sending a type is a usefull way to quickly let the recieving overlay know
  // what the data is for
  function sendScriptEvent(type,data){
    //Combine our type and data into a single object, then turn that object into a json string, so we can transfer it.
    data = JSON.stringify({ type: type, data: data });
    console.info("ScriptEvent Send: " + data);
    //Send our json string to the overlay
    webOverlay.emitScriptEvent(data);
  }
  
  //A helper functiont hat will set our overlays visibility to the oposite of what it currently is
  function toggleWebOverlay(){
    //Get the current visibility of our overlay (true / flase)
    var visible = webOverlay.isVisible();
    //Flip it
    visible = !visible;
    //send the flipped state to our method for setting the state,
    //we do this instead of updating it directly, so that if in the future
    //we want to do more things when showing or hiding out overlay, we only need
    //to add them in one place
    setWebOverlay(visible);
  }
  //Helper function that if called will show our overlay
  function openWebOverlay(){
    setWebOverlay(true);
  }
  //Helper function that if called will hide our overlay
  function closeOverlay(){
    setWebOverlay(false);
  }
  
  //This function will set out overlay to be visible or not, and update the button to reflect the current visible state
  function setWebOverlay(state){
    //Set our overlay's visibility
    webOverlay.setVisible(state);
    //update the buttons state to be true if visible and false if not
    button.editProperties({ isActive: state });
  }
  
  //////////////////////////////
  /////////// Button ///////////
  //////////////////////////////
  
  //Get the main HiFi tablet instance, so that we can add a button for our script
  var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
  
  //Create our button on the tablet (this will also add it to the main HiFi toolbar for desktop users.
  var button = tablet.addButton({
    icon: Script.resolvePath("web-icon-white.svg"),
    activeIcon: Script.resolvePath("web-icon-black.svg"),
    text: "Web Example",
    isActive: false,
    sortOrder: 30
  });
  
  //connect to the click event on the button, so that when the user clicks it, our function is called.
  //We are going to tie out button to the toggle function we wrote above, so that clicking it will hide or show our overlay
  button.clicked.connect(toggleWebOverlay);
  
  //Lets send somthing to our overlay to show that the connection works,
  //and as an example of how you can use the connection
  //Script.setInterval works like window.setInterval in a browser, it starts a timer that will call the function inside every so many miliseconds
  Script.setInterval(function(){
    //send a script event with the function we made earlier, setting a type so that we can tell in the overlay what to do with it
    sendScriptEvent("avatar-position",MyAvatar.position);
  },2000);//2000 will result in a call every 2 seconds
  
  //Connect to the scriptEnding event to cleanup our objects
  Script.scriptEnding.connect(scriptEnding);
  function scriptEnding(){
    //Disconnect our event from the button
    button.clicked.disconnect(toggleWebOverlay);
    //Remove the button
    tablet.removeButton(button);
    //Disconnect our webevent connection
    webOverlay.webEventReceived.disconnect(webEvent);
    //close our weboverlay
    webOverlay.close();
  }
})();
