const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("./Models/Users");
router.post("/login", (req, res) => {
  const { name, password } = req.body;

  User.findOne({ name: name }, (err, user) => {
    if (user != null) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          const error = "Something went wrong  !!";
          res.status(200).json({ msg: error, res: false });
        } else if (result == true) {
          res.status(200).json({ id: user._id, res: true });
        } else {
          const error = "Wrong Password !!";
          res.status(200).json({ msg: error, res: false });
        }
      });
    } else if (err) {
      const error = "Something went wrong  !!";
      res.status(200).json({ res: false, msg: error });
    } else {
      const error = "Please Sign Up First!!";
      res.status(200).json({ res: false, msg: error });
    }
  });
});
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ name: name }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result == true) {
          const error = "Already Registered,  Login please !!";
          res.status(200).json({ msg: error, res: false });
        } else {
          const error = "Use another username !!";
          res.status(200).json({ msg: error, res: false });
        }
      });
    } else if (err) {
      const error = "Something went wrong  !!";

      res.status(200).json({ msg: error, res: false });
    } else {
      const newuser = new User({
        name: name,
        email: email,
        password: password,
      });
      bcrypt.hash(password, 10, (err, hashed) => {
        if (err) {
          const error = "Something went wrong  !!";
          res.status(200).json({ msg: error, res: false });
        } else {
          newuser.password = hashed;
          newuser.save((err, data) => {
            if (err) {
              const error = "Something went wrong  !!";
              res.status(200).json({ msg: error, res: false });
            } else if (data) res.status(200).json({ res: true });
          });
        }
      });
    }
  });
});
router.get("/user/:id", (req, res) => {
  let id = req.params.id;

  User.findById(id, (err, data) => {
    if (err) {
      const error = "Something went wrong  !!";
      res.status(200).json({ error });
    } else if (data) {
      res.status(200).json({ data });
    }
  });
});
router.get("/deleteaccount/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndDelete(id, (err, data) => {
    if (err) {
      const error = "Something went wrong  !!";
      res.status(200).json({ error });
    } else if (data) {
      res.status(200).json({ success: true });
    }
  });
});
router.post("/updatePic/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { $set: { img: req.body.img } }, (err, data) => {
    if (err) {
      const error = "Something went wrong  !!";
      res.status(200).json({ error });
    } else if (data) {
      res.status(200).json({ success: true });
    }
  });
});
router.get("/deletePic/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { $set: { img: null } }, (err, data) => {
    if (err) {
      const error = "Something went wrong  !!";
      res.status(200).json({ error });
    } else if (data) {
      res.status(200).json({ success: true });
    }
  });
});
module.exports = router;
