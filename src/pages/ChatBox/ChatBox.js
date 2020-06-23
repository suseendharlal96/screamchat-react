import React, { useState, useEffect } from "react";

import DayJS from "react-dayjs";
import dayjs from "dayjs";
import ReactLoading from "react-loading";
import Card from "@material-ui/core/Card/Card";

import firebase from "../../services/firebase";
import authCredentials from "../Auth/AuthCredentials";
import Images from "../../images/images";
import "./ChatBox.css";
import { firestore } from "firebase";

const ChatBox = (props) => {
  const [loading, setLoading] = useState(false);
  const [groupChatId, setGroupChatId] = useState("");
  const [currentPeerUserMessages, setcurrentPeerUserMessages] = useState([]);
  const [sticker, setSticker] = useState(false);
  const [msgValue, setmsgValue] = useState("");
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem(authCredentials.name)
  );
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem(authCredentials.id)
  );
  const [currentUserPic, setcurrentUserPic] = useState(
    localStorage.getItem(authCredentials.picUrl)
  );
  const [currentUserFbaseId, setcurrentUserFbaseId] = useState(
    localStorage.getItem(authCredentials.fbaseDocId)
  );
  const [currentPeerUser, setCurrentPeerUser] = useState(props.currentPeerUser);
  const [listMsg, setListMsg] = useState([]);
  //   const [removeListener, setremoveListener] = useState(null);

  useEffect(() => {
    console.log(props.currentPeerUser);
    setCurrentPeerUser(props.currentPeerUser);
    getCurrentPeerUsermsg();
    getListHistory();
    setSticker(false);
    scrollToBottom();
    // return () => {
    //   if (removeListener) {
    //     removeListener();
    //   }
    // };
  }, [props.currentPeerUser]);

  const getListHistory = () => {
    // if (removeListener) {
    //   removeListener();
    // }
    listMsg.length = 0;
    setLoading(true);
    if (hashString(currentUserId) <= hashString(currentPeerUser.id)) {
      setGroupChatId(`${currentUserId}-${currentPeerUser.id}`);
    } else {
      setGroupChatId(`${currentPeerUser.id}-${currentUserId}`);
    }
    let a;
    setLoading(false);
    if (groupChatId !== "") {
      firebase
        .firestore()
        .collection("messages")
        .doc(groupChatId)
        .collection(groupChatId)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((item) => {
            if (item.type === authCredentials.type) {
              setListMsg(item.doc.data());
            }
          });
          setLoading(false);
        });
    }
    // setremoveListener(a);
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - 1);
      hash = hash & hash;
    }
    return hash;
  };

  const scrollToBottom = () => {};

  const onKeyPress = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      sendMessage(event.target.value, 0);
    }
  };

  const getCurrentPeerUsermsg = () => {
    let notificationMsg = [];
    firebase
      .firestore()
      .collection("users")
      .doc(currentPeerUser.docKey)
      .get()
      .then((docRef) => {
        setcurrentPeerUserMessages(docRef.data().messages);
      });
    currentPeerUserMessages.map((item) => {
      if (item.notificationId !== currentUserId) {
        notificationMsg.push({
          notificationId: item.notificationId,
          number: item.number,
        });
      }
    });
    if (notificationMsg.length > 0) {
      firebase
        .firestore()
        .collection("users")
        .doc(currentPeerUser.docKey)
        .update({ messages: notificationMsg })
        .then((data) => {
          console.log("success");
        })
        .catch((err) => {
          props.showToast(0, err.toString());
        });
    }
  };

  const stickerContent = (
    <div className="viewStickers">
      <img
        className="imgSticker"
        src={Images.like}
        alt=""
        onClick={() => sendMessage("like", 2)}
      />
      <img
        className="imgSticker"
        src={Images.gif1}
        alt=""
        onClick={() => sendMessage("gif1", 2)}
      />
    </div>
  );

  const sendMessage = (message, type) => {
    if (sticker && type === 2) {
      setSticker(false);
    }
    if (message.trim() === "") {
      return;
    }
    const time = dayjs();
    const itemMessage = {
      idFrom: currentUserId,
      idTo: currentPeerUser.id,
      time: time,
      message: message.trim(),
      type: type,
    };
    firebase
      .firestore()
      .collection("messages")
      .doc(groupChatId)
      .collection(groupChatId)
      .doc(time)
      .set(itemMessage)
      .then(() => {
        setmsgValue("");
      });
  };
  const send = () => {};
  const choosePhoto = () => {};
  const openSticker = () => {
    setSticker(!sticker);
  };

  const renderListMsg = () => {
    if (listMsg.length > 0) {
      let msg = [];
      listMsg.forEach((item, index) => {
        if (item.idFrom === currentUserId) {
          if (item.type === 0) {
            msg.push(
              <div className="viewItemRight" key={item.time}>
                <span className="textContentItem">{item.content}</span>
              </div>
            );
          } else if (item.type === 1) {
            msg.push(
              <div className="viewItemRight2" key={item.time}>
                <img className="imgItemRight" src={item.content} />
              </div>
            );
          } else {
            msg.push(
              <div className="viewItemRight3" key={item.time}>
                <img className="imgItemRight" src={getGifImg(item.content)} />
              </div>
            );
          }
        } else {
          if (item.type === 0) {
            msg.push(
              <div className="viewWrapItemLeft" key={item.time}>
                <div className="viewWrapItemLeft3">
                  {isLastMsgLeft(index) ? (
                    <img src={currentPeerUser.url} className="peerAvatarLeft" />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft">
                    <span className="textContentItem">{item.content}</span>
                  </div>
                </div>
                {isLastMsgRight(index) ? (
                  <span className="textTimeLeft">
                    <div>{dayjs(+item.time).format("DD/MM/YYYY")}</div>
                  </span>
                ) : null}
              </div>
            );
          } else if (item.type === 1) {
            msg.push(
              <div className="viewWrapItemLeft2" key={item.time}>
                <div className="viewWrapItemLeft3">
                  {isLastMsgLeft(index) ? (
                    <img src={currentPeerUser.url} className="peerAvatarLeft" />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft2">
                    <img src={item.content} className="imgItemLeft" />
                  </div>
                </div>
                {isLastMsgLeft(index) ? (
                  <span className="textTimeLeft">
                    <div>{dayjs(+item.time).format("DD/MM/YYYY")}</div>
                  </span>
                ) : null}
              </div>
            );
          } else {
            msg.push(
              <div className="viewWrapItemLeft2" key={item.time}>
                <div className="viewWrapItemLeft3">
                  {isLastMsgLeft(index) ? (
                    <img src={currentPeerUser.url} className="peerAvatarLeft" />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft3" key={item.time}>
                    <img
                      className="imgItemRight"
                      src={getGifImg(item.content)}
                    />
                  </div>
                </div>
                {isLastMsgLeft(index) ? (
                  <span className="textTimeLeft">
                    <div>{dayjs(+item.time).format("DD/MM/YYYY")}</div>
                  </span>
                ) : null}
              </div>
            );
          }
        }
      });
      return msg;
    } else {
      return (
        <div className="viewWrapSayHi">
          <span className="textSayHi">Say hi to new friend!</span>
          <img className="imgWaveHand" src={Images.wave} />
        </div>
      );
    }
  };

  const getGifImg = (val) => {
    switch (val) {
      case "gif1":
        return Images.gif1;
      case "like":
        return Images.like;
    }
  };

  const isLastMsgLeft = (index) => {
    if (
      (index + 1 < listMsg.length &&
        listMsg[index + 1].idFrom === currentUserId) ||
      index === listMsg.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  };
  const isLastMsgRight = (index) => {
    if (
      (index + 1 < listMsg.length &&
        listMsg[index + 1].idFrom !== currentUserId) ||
      index === listMsg.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Card className="viewChatBoard">
      <div className="headerChatBoard">
        <img className="viewAvatarItem" src={currentPeerUser.url} alt="" />
        <span className="textHeaderChatBoard">
          <p style={{ fontSize: "20px" }}>{currentPeerUser.name}</p>
        </span>
        <div className="aboutme">
          <span>
            <p style={{ fontSize: "20px" }}>{currentPeerUser.description}</p>
          </span>
        </div>
      </div>
      <div className="viewListContentChat">
        {renderListMsg()}
        <div />
      </div>
      {sticker ? stickerContent : null}
      <div className="viewBottom">
        <img
          className="icOpenGallery"
          src={Images.sendpic}
          alt="sendpic"
          onClick={send}
          title="Send picture"
        />
        <img
          className="viewInputGallery"
          accept="images/*"
          type="file"
          alt="sendpic"
          onClick={choosePhoto}
        />
        <img
          className="icOpenSticker"
          src={Images.sendsticker}
          alt="sticker"
          onClick={openSticker}
          title="Send Sticker"
        />
        <input
          className="viewInput"
          placeholder="type a message..."
          value={msgValue}
          onChange={(event) => setmsgValue(event.target.value)}
          onKeyPress={onKeyPress}
        />
        <img
          title="Send message"
          className="icSend"
          src={Images.sendmsg}
          onClick={() => {
            sendMessage(msgValue, 0);
          }}
        />
      </div>
      {loading ? (
        <div>
          <ReactLoading
            type={"spin"}
            color={"#203152"}
            width={"3%"}
            height={"3%"}
          />
        </div>
      ) : null}
    </Card>
  );
};

export default ChatBox;
