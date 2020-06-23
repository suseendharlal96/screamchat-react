import React, { useState, useEffect } from "react";

import ReactLoading from "react-loading";
import firebase from "../../services/firebase";

import authCredentials from "../Auth/AuthCredentials";
import Camera from "../../images/camera.png";
import "./Profile.css";

const Profile = (props) => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem(authCredentials.name)
  );
  const [currentUserPicUrl, setcurrentUserPicUrl] = useState(
    localStorage.getItem(authCredentials.picUrl)
  );
  const [currentUserFbaseId, setcurrentUserFbaseId] = useState(
    localStorage.getItem(authCredentials.fbaseDocId)
  );
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem(authCredentials.id)
  );
  const [description, setDescription] = useState(
    localStorage.getItem(authCredentials.description)
  );
  const [loading, setloading] = useState(false);

  const [newPic, setNewPic] = useState(null);
  const [newpicUrl, setNewpicUrl] = useState("");

  useEffect(() => {
    if (!localStorage.getItem(authCredentials.id)) {
      props.history.push("/");
    }
  }, []);

  const handleName = (event) => {
    setCurrentUser(event.target.value);
  };

  const handleAboutMe = (event) => {
    setDescription(event.target.value);
  };

  const changePic = (event) => {
    if (event.target.files && event.target.files[0]) {
      const prefixFileType = event.target.files[0].type.toString();
      if (prefixFileType.indexOf(authCredentials.prefixImg) !== 0) {
        props.showToast(0, "the file is not a image");
        return;
      }
      setNewPic(event.target.files[0]);
      setcurrentUserPicUrl(URL.createObjectURL(event.target.files[0]));
    } else {
      props.showToast(0, "something wrong");
    }
  };

  const uploadAvatar = () => {
    setloading(true);
    if (newPic) {
      const uploadTask = firebase
        .storage()
        .ref()
        .child(currentUserId)
        .put(newPic);
      uploadTask.on(
        authCredentials.stateChanged,
        null,
        (err) => {
          props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
            updateUserInfo(true, downloadUrl);
          });
        }
      );
    } else {
      updateUserInfo(false, null);
    }
  };

  const updateUserInfo = (isUpdateimgUrl, downloadUrl) => {
    let newInfo;
    if (isUpdateimgUrl) {
      newInfo = {
        name: currentUser,
        description: description,
        url: downloadUrl,
      };
    } else {
      newInfo = {
        name: currentUser,
        description: description,
      };
    }
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserFbaseId)
      .update(newInfo)
      .then((data) => {
        localStorage.setItem(authCredentials.name, currentUser);
        localStorage.setItem(authCredentials.description, description);
        if (isUpdateimgUrl) {
          localStorage.setItem(authCredentials.picUrl, downloadUrl);
        }
        setloading(false);
        props.showToast(1, "Update info successfully");
      });
  };

  const triggerChange = () => {
    const fileInput = document.getElementById("image");
    fileInput.click();
  };

  return (
    <div className="profileroot">
      {/* <div className="headerprofile">
        <span>Profile</span>
      </div> */}
      <img alt="" className="avatar" src={currentUserPicUrl} />
      <div className="viewWrapInputFile">
        <img
          title="Edit your profile pic"
          className="imgInputFile"
          alt="icon"
          src={Camera}
          onClick={triggerChange}
        />
        <input
          accept="image/*"
          className="viewInputFile"
          type="file"
          id="image"
          hidden="hideden"
          onChange={changePic}
        />
      </div>
      <span className="textLabel">Name</span>
      <input
        className="textInput"
        value={currentUser ? currentUser : ""}
        placeholder="name"
        onChange={handleName}
      />
      <span className="textLabel">About Me</span>
      <input
        className="textInput"
        value={description ? description : ""}
        placeholder="About yourself"
        onChange={handleAboutMe}
      />
      <div>
        <button className="btnUpdate" onClick={uploadAvatar}>
          Save
        </button>
        <button
          className="btnback"
          onClick={() => {
            props.history.push("/chat");
          }}
        >
          Back
        </button>
      </div>
      {loading ? (
        <div>
          <ReactLoading
            type={"spin"}
            color={"#203152"}
            height={"3%"}
            width={"3%"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
