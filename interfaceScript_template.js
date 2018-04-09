
//Define out scope
(function() {

  //Hook the script ending event
  Script.scriptEnding.connect(scriptEnding);
  
  //Method called when script is ending, cleanup needs to happen here
  //Any overlays, events you hanve connected to etc, need to be removed/disconnected
  function scriptEnding(){
    
  }
  
})();
