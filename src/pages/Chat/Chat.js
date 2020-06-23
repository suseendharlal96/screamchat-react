import React, { useState, useEffect } from "react";

import firebase from "../../services/firebase";
import "./Chat.css";
import authCredentials from "../Auth/AuthCredentials";
import ChatBox from "../ChatBox/ChatBox";
import Welcome from "../Welcome/Welcome";
const Chat = (props) => {
  const [currentUser, setCurrentUser] = useState("");
  const [currentPeerUser, setCurrentPeerUser] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setloading] = useState(false);
  const [notifications, setnotifications] = useState([]);
  const [notificationsRemoved, setnotificationRemoved] = useState([]);
  const [currentUserMsg, setcurrentUserMsg] = useState([]);
  const [currentUserPic, setcurrentUserPic] = useState("");
  const [currentUserFbaseId, setcurrentUserFbaseId] = useState("");
  const [searchUsers, setsearchUsers] = useState([]);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    setCurrentUser(localStorage.getItem(authCredentials.name));
    setCurrentUserId(localStorage.getItem(authCredentials.id));
    setcurrentUserPic(localStorage.getItem(authCredentials.picUrl));
    setcurrentUserFbaseId(localStorage.getItem(authCredentials.fbaseDocId));
    console.log(currentUserFbaseId);
    console.log(localStorage.getItem(authCredentials.fbaseDocId));
    firebase
      .firestore()
      .collection("users")
      .doc(localStorage.getItem(authCredentials.fbaseDocId))
      .get()
      .then((doc) => {
        if (doc) {
          let msg = [];
          doc.data().messages.map((item) => {
            msg.push({
              notificationId: item.notificationId,
              number: item.number,
            });
          });
          setcurrentUserMsg(msg);
          setnotifications(currentUserMsg);
        }
      });
    getListUser();
  }, []);

  useEffect(() => {
    renderListUser();
  }, [searchUsers]);

  const getListUser = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((result) => {
        console.log(result);
        if (result && result.docs) {
          if (result.docs.length > 0) {
            let usersList = [];
            usersList = [...result.docs];
            const users = [];
            usersList.forEach((item, index) => {
              users.push({
                key: index,
                docKey: item.id,
                id: item.data().id,
                name: item.data().name,
                messages: item.data().messages,
                url: item.data().url,
                description: item.data().description,
              });
            });
            setsearchUsers(users);
            console.log(users);
            console.log(searchUsers);
            setloading(false);
            if (users.length > 0) {
              renderListUser();
            }
          }
        }
      });
  };

  const renderListUser = () => {
    console.log(searchUsers);
    let viewListUser = [];
    let className = "";
    searchUsers &&
      searchUsers.length &&
      searchUsers.map((item, index) => {
        console.log(item);
        if (item.id !== currentUserId) {
          className = getClassNameForUserAndNotification(item.id);
          viewListUser.push(
            <React.Fragment key={index}>
              <button
                style={{ cursor: "pointer" }}
                title={`Click to start a conversation with ${item.name}`}
                id={item.key}
                className={className}
                onClick={() => {
                  notificationsRead(item.id);
                  setCurrentPeerUser(item);
                  document.getElementById(item.key).style.backgroundColor =
                    "#fff";
                  document.getElementById(item.key).style.color = "#fff";
                }}
              >
                <img className="viewAvatarItem" src={item.url} alt="" />
                <div className="viewWrapContentItem">
                  <span className="textItem">{item.name}</span>
                </div>
                {className === "viewWrapItemNotification" ? (
                  <p id={item.key} className="newmessages">
                    New Messages
                  </p>
                ) : null}
              </button>
            </React.Fragment>
          );
        }
      });
    console.log(viewListUser);
    if (viewListUser.length > 0) {
      setContacts(viewListUser);
    }
  };

  const notificationsRead = (id) => {
    const removedNotifications = [];
    notifications.forEach((item) => {
      if (item.notificationId.length > 0) {
        if (item.notificationId !== id) {
          removedNotifications.push({
            notificationId: item.notificationId,
            number: item.number,
          });
        }
      }
    });
    setnotificationRemoved(removedNotifications);
    updateRenderList();
  };
  const updateRenderList = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserId)
      .update({ messages: notificationsRemoved });
    setnotifications(notificationsRemoved);
  };

  const getClassNameForUserAndNotification = (userId) => {
    let numbers = 0;
    let className = "";
    let check = false;
    if (currentUserId === userId) {
      className = "viewWrapItemFocused";
    } else {
      notifications.forEach((item) => {
        if (item.notificationId.length > 0) {
          check = true;
          numbers = item.number;
        }
      });
      if (check) {
        className = "viewWrapItemNotification";
      } else {
        className = "viewWrapItem";
      }
    }
    return className;
  };

  const logout = () => {
    firebase.auth().signOut();
    props.history.push("/");
    localStorage.clear();
  };

  const navToProfile = () => {
    props.history.push("/profile");
  };

  const handleSearch = (event) => {
    let searchInput = event.target.value.toLowerCase();
    let searchedUser = [...searchUsers];
    if (event.target.value === "") {
      searchedUser = [...searchUsers];
    }
    console.log(searchedUser);
    searchedUser = searchUsers.filter((data) =>
      data.name.toLowerCase().includes(searchInput)
    );
    // renderListUser();
    console.log(searchedUser);
    let viewListUser = [];
    let className = "";
    searchedUser &&
      searchedUser.length &&
      searchedUser.map((item, index) => {
        console.log(item);
        if (item.id !== currentUserId) {
          className = getClassNameForUserAndNotification(item.id);
          viewListUser.push(
            <React.Fragment key={index}>
              <button
                id={item.key}
                className={className}
                onClick={() => {
                  notificationsRead(item.id);
                  setCurrentUser(item);
                  document.getElementById(item.key).style.backgroundColor =
                    "#fff";
                  document.getElementById(item.key).style.color = "#fff";
                }}
              >
                <img className="viewAvatarItem" src={item.url} alt="" />
                <div className="viewWrapContentItem">
                  <span className="textItem">{item.name}</span>
                </div>
                {className === "viewWrapItemNotification" ? (
                  <p id={item.key} className="newmessages">
                    New Messages
                  </p>
                ) : null}
              </button>
            </React.Fragment>
          );
        }
      });
    console.log(viewListUser);
    setContacts(viewListUser);
  };

  return (
    <div className="root">
      <div className="body">
        <div className="viewListUser">
          <div className="profileviewleftside">
            <img
              title="Edit your profile"
              src={currentUserPic}
              className="ProfilePicture"
              alt=""
              onClick={navToProfile}
            />
            <button className="Logout" onClick={logout}>
              Logout
            </button>
          </div>
          <div className="rootsearchbar">
            <div className="input-container">
              <i className="fa fa-search icon"></i>
              <input
                className="input-field"
                placeholder="Search Contacts"
                onChange={handleSearch}
              />
            </div>
          </div>
          {contacts ? (
            contacts.length > 0 ? (
              contacts
            ) : (
              <p>No contacts found</p>
            )
          ) : (
            <p>Loading contacts...</p>
          )}
        </div>
        <div className="viewBoard">
          {currentPeerUser ? (
            <ChatBox />
          ) : (
            <Welcome username={currentUser} profilePic={currentUserPic} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
