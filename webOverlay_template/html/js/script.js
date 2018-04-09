/* globals EventBridge */

(function() {
  
  document.addEventListener('DOMContentLoaded', onPageLoad);
  
  function onPageLoad(){
    EventBridge.scriptEventReceived.connect(scriptEvent);
  }
  
  function scriptEvent(msg){
    console.info("ScriptEvent Recieved: " + msg);
    msg = JSON.parse(msg);
    switch(msg.type){
      case "avatar-position":
        document.querySelector("#text").textContent = msg.data.x.toFixed(2) + ", " + msg.data.y.toFixed(2) + ", " + msg.data.z.toFixed(2);
        break;
    }
  }
  
  function sendWebEvent(type,data){
    data = JSON.stringify({ type: type, data: data });
    console.info("WebEvent Send: " + data);
    EventBridge.emitWebEvent(data);
  }
  
})();