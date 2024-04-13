import { useRef, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  GlobalProvider,
  useClient,
  useStart,
  useUsers,
} from "../../../contexts/GeneralContext";
import { rtcProps as options } from "../../Utils/agora";
import { useNavigate } from "react-router-dom";

const SDK = () => {
  return (
    <GlobalProvider>
      <Content />
    </GlobalProvider>
  );
};

const Content = () => {
  const setUsers = useUsers()[1];
  const [start, setStart] = useStart();
  const rtc = useClient();

  useEffect(() => {
    const init = async () => {
      rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      initClientEvents();
      const uid = await rtc.current.client.join(
        options.appId,
        options.channel,
        options.token,
        null
      );
      rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setUsers((prevUsers) => {
        return [
          ...prevUsers,
          {
            uid: uid,
            audio: true,
            video: true,
            client: true,
            videoTrack: rtc.current.localVideoTrack,
          },
        ];
      });
      await rtc.current.client.publish([
        rtc.current.localAudioTrack,
        rtc.current.localVideoTrack,
      ]);
      setStart(true);
    };

    const initClientEvents = () => {
      rtc.current.client.on("user-published", async (user, mediaType) => {
        await rtc.current.client.subscribe(user, mediaType);

        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          setUsers((prevUsers) => {
            return [
              ...prevUsers,
              {
                uid: user.uid,
                audio: user.hasAudio,
                video: user.hasVideo,
                client: false,
                videoTrack: remoteVideoTrack,
              },
            ];
          });
        }

        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
          setUsers((prevUsers) => {
            return prevUsers.map((User) => {
              if (User.uid === user.uid) {
                return { ...User, audio: user.hasAudio };
              }
              return User;
            });
          });
        }
      });

      rtc.current.client.on("user-unpublished", (user, type) => {
        if (type === "audio") {
          setUsers((prevUsers) => {
            return prevUsers.map((User) => {
              if (User.uid === user.uid) {
                return { ...User, audio: !User.audio };
              }
              return User;
            });
          });
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });
    };

    init();

    return () => {
      if (rtc.current.client) {
        rtc.current.client.leave();
      }
    };
  }, []); // Empty dependency array means this effect will run once after the initial render

  return <div className="App">{start && <Videos />}</div>;
};

const Videos = () => {
  const users = useUsers()[0];

  return (
    <div id="videos">
      {users.length &&
        users.map((user) => <Video key={user.uid} user={user} />)}
    </div>
  );
};

export const Video = ({ user }) => {
  const vidDiv = useRef(null);

  const playVideo = () => {
    user.videoTrack.play(vidDiv.current);
  };

  const stopVideo = () => {
    user.videoTrack.stop();
  };

  useEffect(() => {
    playVideo();
    return () => {
      stopVideo();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="vid" ref={vidDiv}>
      <Controls user={user} />
    </div>
  );
};

export const Controls = ({ user }) => {
  const setStart = useStart()[1];
  const setUsers = useUsers()[1];
  const rtc = useClient();
  const navigate = useNavigate();

  const leaveChannel = async () => {
    await rtc.current.localAudioTrack.close();
    await rtc.current.localVideoTrack.close();
    await rtc.current.client.leave();
    setUsers([]);
    setStart(false);
    navigate("/");
  };

  const mute = (type, id) => {
    if (type === "audio") {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.uid === id) {
            user.client && rtc.current.localAudioTrack.setEnabled(!user.audio);
            return { ...user, audio: !user.audio };
          }
          return user;
        });
      });
    } else if (type === "video") {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.uid === id) {
            user.client && rtc.current.localVideoTrack.setEnabled(!user.video);
            return { ...user, video: !user.video };
          }
          return user;
        });
      });
    }
  };

  return (
    <div className="controls">
      {
        <p
          className={user.audio ? "on" : ""}
          onClick={() => user.client && mute("audio", user.uid)}
        >
          Mic
        </p>
      }
      {
        <p
          className={user.video ? "on" : ""}
          onClick={() => user.client && mute("video", user.uid)}
        >
          Video
        </p>
      }
      {user.client && <p onClick={() => leaveChannel()}>Quit</p>}
    </div>
  );
};

export default SDK;
