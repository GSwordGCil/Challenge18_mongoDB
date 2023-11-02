//controllers/thoughtController.js

const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
    async getAllThoughts(req, res) {
        try {
          const thoughts = await Thought.find();
          res.json(thoughts);
        } catch (err) {
          res.status(500).json(err);
        }
    },

  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought({ body }, res) {
    try {
      const newThought = await Thought.create(body);

      await User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: newThought._id } },
        { new: true }
      );

      res.json(newThought);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      await Thought.findByIdAndDelete(req.params.thoughtId);
      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $push: { reactions: req.body } },
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
