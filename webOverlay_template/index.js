

/* globals Script, OverlayWebWindow, Tablet, MyAvatar*/


(function() {
  
  var overlayProps = {
    title: "",
    source: Script.resolvePath("html/index.html"),
    width: 400,
    height: 800,
    visible: false,
  };
  var overlayHTML = "html/index.html";
  var overlayName = "Bootstrap Overlay";
  
  var webOverlay = new OverlayWebWindow(overlayProps);
  
  webOverlay.webEventReceived.connect(webEvent);
  
  Script.scriptEnding.connect(scriptEnding);
  
  var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

  var button = tablet.addButton({
    icon: Script.resolvePath("web-icon-white.svg"),
    activeIcon: Script.resolvePath("web-icon-black.svg"),
    text: "Web Bootstrap",
    isActive: false,
    sortOrder: 30
  });
  
  button.clicked.connect(tabletButtonClick);
  
  Script.setInterval(function(){
    sendScriptEvent("avatar-position",MyAvatar.position);
  },2000);
  
  function webEvent(msg){
    console.info("WebEvent Recieved: " + msg);
    msg = JSON.parse(msg);
  }
  
  function sendScriptEvent(type,data){
    data = JSON.stringify({ type: type, data: data });
    console.info("ScriptEvent Send: " + data);
    webOverlay.emitScriptEvent(data);
  }
  
  function tabletButtonClick(){
    toggleWebOverlay();
  }
  
  function toggleWebOverlay(){
    setWebOverlay(!webOverlay.isVisible());
  }
  
  function openWebOverlay(){
    setWebOverlay(true);
  }
  
  function closeOverlay(){
    setWebOverlay(false);
  }
  
  function setWebOverlay(state){
    webOverlay.setVisible(state);
    button.editProperties({ isActive: state });
  }
  
  function scriptEnding(){
    button.clicked.disconnect(tabletButtonClick);
    tablet.removeButton(button);
    webOverlay.webEventReceived.disconnect(webEvent);
    webOverlay.close();
  }
  
})();