//controller/userController.js

const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find().populate('thoughts').populate('friends');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .populate('thoughts')
                .populate('friends');
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                { new: true }
            );
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            await User.findOneAndDelete({ _id: req.params.userId });
            await Thought.deleteMany({ userId: req.params.userId });
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },


    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: req.body.friendId } },
                { new: true }
            );
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },


    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

