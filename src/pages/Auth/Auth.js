import React, { useState } from "react";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import Appicon from "../../images/talk64.png";
import firebase from "../../services/firebase";
import authCredentials from "./AuthCredentials";

const styles = {
  form: {
    textAlign: "center",
  },
  image: {
    margin: "10px auto",
  },
  textField: {
    marginBottom: "10px",
  },
  button: {
    marginTop: "15px",
    position: "relative",
  },
  generalerror: {
    color: "red",
  },
  spinner: {
    position: "absolute",
  },
  mode: {
    marginTop: "15px",
  },
};
const Login = (props) => {
  const { classes } = props;
  const [loginMode, setLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [name, setname] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    generalerror: "",
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email !== "" && password !== "") {
      if (loginMode) {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(async (result) => {
            let user = result.user;
            if (user) {
              await firebase
                .firestore()
                .collection("users")
                .where("id", "==", user.uid)
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    const currentData = doc.data();
                    localStorage.setItem(authCredentials.id, currentData.id);
                    localStorage.setItem(
                      authCredentials.name,
                      currentData.name
                    );
                    localStorage.setItem(
                      authCredentials.email,
                      currentData.email
                    );
                    localStorage.setItem(
                      authCredentials.password,
                      currentData.password
                    );
                    localStorage.setItem(
                      authCredentials.picUrl,
                      currentData.url
                    );
                    localStorage.setItem(authCredentials.description, "");
                    localStorage.setItem(authCredentials.fbaseDocId, doc.id);
                  });
                });
            }
            props.history.push("/chat");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (
          confirmPassword !== "" &&
          password === confirmPassword &&
          name !== ""
        ) {
          setErrors({
            ...errors,
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            generalerror: "",
          });

          try {
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then((result) => {
                firebase
                  .firestore()
                  .collection("users")
                  .add({
                    id: result.user.uid,
                    email: email,
                    password: password,
                    name: name,
                    url: "",
                    messages: [{ notificationId: "", number: 0 }],
                    description: "",
                  })
                  .then((docRef) => {
                    localStorage.setItem(authCredentials.id, result.user.uid);
                    localStorage.setItem(authCredentials.name, name);
                    localStorage.setItem(authCredentials.email, email);
                    localStorage.setItem(authCredentials.password, password);
                    localStorage.setItem(authCredentials.picUrl, "");
                    localStorage.setItem(authCredentials.description, "");
                    localStorage.setItem(authCredentials.fbaseDocId, docRef.id);
                    localStorage.setItem(
                      authCredentials.stateChanged,
                      "state_changed"
                    );
                    setEmail("");
                    setPassword("");
                    setname("");
                    setErrors({
                      ...errors,
                      email: "",
                      password: "",
                      confirmPassword: "",
                      name: "",
                      generalerror: "",
                    });
                    props.history.push("/chat");
                  })
                  .catch((err) => {
                    console.log(1, err);
                  });
              })
              .catch((err) => {
                console.log(err);
                if (err && err.message) {
                  setErrors({ ...errors, generalerror: err.message });
                }
              });
          } catch (error) {
            console.log(2, error);
            setErrors({ ...errors, generalerror: "Signup unsuccessful" });
          }
        } else {
          if (confirmPassword === "") {
            setErrors({
              ...errors,
              confirmPassword: "Must not be empty.",
            });
          }
          if (password !== confirmPassword) {
            setErrors({
              ...errors,
              confirmPassword: "passwords do not match.",
            });
          }
          if (name === "") {
            setErrors({ ...errors, name: "Must not be empty." });
          }
        }
      }
    } else {
      if (email === "") {
        setErrors({
          ...errors,
          email: "Must not be empty.",
        });
      }
      if (password === "") {
        setErrors({
          ...errors,
          password: "Must not be empty.",
        });
      }
    }
  };
  const handleInput = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
    if (event.target.name === "password") {
      setPassword(event.target.value);
    }
    if (event.target.name === "confirmPassword") {
      setconfirmPassword(event.target.value);
    }
    if (event.target.name === "nickname") {
      setname(event.target.value);
    }
  };
  const toggleMode = () => {
    setLoginMode(!loginMode);
    setErrors({
      ...errors,
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      generalerror: "",
    });
    setconfirmPassword("");
    setname("");
  };
  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={Appicon} alt="scream" className={classes.image} />
        <Typography variant="h4" className={classes.title}>
          {loginMode ? "Login" : "Signup"}
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            error={errors.email !== "" ? true : false}
            helperText={
              errors.email && errors.email.length > 0 ? errors.email : ""
            }
            className={classes.textField}
            onChange={handleInput}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            value={password}
            error={errors.password !== "" ? true : false}
            helperText={
              errors.password && errors.password.length > 0
                ? errors.password
                : ""
            }
            className={classes.textField}
            onChange={handleInput}
            fullWidth
          />
          {!loginMode && (
            <React.Fragment>
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                error={errors.confirmPassword !== "" ? true : false}
                helperText={
                  errors.confirmPassword && errors.confirmPassword.length > 0
                    ? errors.confirmPassword
                    : ""
                }
                value={confirmPassword}
                className={classes.textField}
                onChange={handleInput}
                fullWidth
              />
              <TextField
                id="nickname"
                name="nickname"
                type="text"
                label="Name"
                value={name}
                error={errors.name !== "" ? true : false}
                helperText={
                  errors.name && errors.name.length > 0 ? errors.name : ""
                }
                className={classes.textField}
                onChange={handleInput}
                fullWidth
              />
            </React.Fragment>
          )}
          {errors &&
            errors.generalerror &&
            errors.generalerror.length >
              0(
                <Typography variant="body2" className={classes.generalerror}>
                  {errors.generalerror}
                </Typography>
              )}
          <Button
            type="submit"
            variant="contained"
            className={classes.button}
            color="primary"
            disabled={props.loading}
            disableFocusRipple={true}
          >
            {/* {props.loading ? (
              <CircularProgress size={20} className={classes.spinner} />
            ) : (
              ""
            )} */}
            {loginMode ? "Login" : "Signup"}
          </Button>
        </form>
        <Button
          variant="outlined"
          className={classes.mode}
          color="secondary"
          disabled={props.loading}
          onClick={toggleMode}
        >
          {loginMode ? "Switch to Signup" : "Switch to login"}
        </Button>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

export default withStyles(styles)(Login);
