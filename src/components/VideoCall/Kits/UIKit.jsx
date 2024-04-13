import { useState } from "react";
import AgoraUIKit from "agora-react-uikit";
import { rtcProps } from "../../Utils/agora";

function UIKit() {
  const [videoCall, setVideoCall] = useState(false);

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
