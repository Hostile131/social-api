const { User, Thought } = require("../models");

const userController = {
  // Get all users
  getAllUser(req, res) {
    User.find()
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Get user by id
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with that ID" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Create user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update user by id
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  // Delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with that ID" });
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  // add friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  // remove friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with that ID" });
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
