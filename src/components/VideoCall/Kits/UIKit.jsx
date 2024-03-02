import { useState } from "react";
import AgoraUIKit from "agora-react-uikit";

function UIKit() {
  const [videoCall, setVideoCall] = useState(false);

  const rtcProps = {
    appId: "3d1f6eddcea44e1cba76d97ca4b6b4bd",
    channel: "TestingForIOS",
    token:
      "007eJxTYEi7vkPi+zKRVOEDNy2u9StcS1ku/+XQktjzmk8eyP5fEPBFgcE4xTDNLDUlJTk10cQk1TA5KdHcLMXSPDnRJMksySQpJWn1w9SGQEYG49oKJkYGCATxeRlCUotLMvPS3fKLPP2DGRgAmaombQ==",
  };

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  return videoCall ? (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  ) : (
    <h3 onClick={() => setVideoCall(true)}>Join</h3>
  );
}

export default UIKit;
