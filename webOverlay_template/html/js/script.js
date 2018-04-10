// This is the script to run in our webOverlay
// It is running in a QT chromium web instance so the javascript is pretty much just regular browser JS,
// There are a few extra exposed scripting objects.

//Declare our scope
(function() {
  
  // Hook the page load event so we know when or page has loaded, and dont start doing stuff before then
  document.addEventListener('DOMContentLoaded', onPageLoad);
  
  // Page load will call this function
  function onPageLoad(){
    // Much like in the interface script, we need to register a function with the Eventbridge torecieve the messages
    EventBridge.scriptEventReceived.connect(scriptEvent);
  }
  
  // messages sent from the interface script will be recieved here
  function scriptEvent(msg){
    console.info("ScriptEvent Recieved: " + msg);
    // We are sending json so lets parse it back into an object
    msg = JSON.parse(msg);
    // here is where the type becomes usefull, and let us choose what to do with the message we recieved
    switch(msg.type){
      case "avatar-position":
        // We are going to display the avatar position in the overlay as text, as an example of passing data
        document.querySelector("#text").textContent = msg.data.x.toFixed(2) + ", " + msg.data.y.toFixed(2) + ", " + msg.data.z.toFixed(2);
        break;
    }
  }
  
  // this function is setup to send data back to the interface script
  function sendWebEvent(type,data){
    data = JSON.stringify({ type: type, data: data });
    console.info("WebEvent Send: " + data);
    EventBridge.emitWebEvent(data);
  }
  
})();
