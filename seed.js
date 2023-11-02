// seed.js

const mongoose = require('mongoose');
const db = require('./config/connection');
const { User, Thought } = require('./models');

const userSeedData = [];
for (let i = 1; i <= 10; i++) {
  userSeedData.push({
    username: `user${i}`,
    email: `user${i}@example.com`,
  });
}

db.once('open', async () => {
  await User.deleteMany({});
  await Thought.deleteMany({});

  const users = await User.insertMany(userSeedData);

  for (const user of users) {
    const thoughts = [];
    for (let i = 1; i <= 2; i++) {
      const thought = await Thought.create({
        thoughtText: `This is thought ${i} from ${user.username}`,
        username: user.username,
      });
      thoughts.push(thought._id);
    }
    user.thoughts = thoughts;
    await user.save();
  }

  // Randomly assign friends to each user
  const updatedUsers = await User.find({});
  for (const user of updatedUsers) {
    // Randomly select a number of friends for each user
    const numFriends = Math.floor(Math.random() * updatedUsers.length);
    // Shuffle the array of users
    const shuffledUsers = updatedUsers.sort(() => 0.5 - Math.random());
    // Select the first numFriends users from the shuffled array as friends
    const friends = shuffledUsers.slice(0, numFriends).map((u) => u._id);
    // Remove duplicates and the user's own ID from the friends array
    const uniqueFriends = [...new Set(friends)].filter(
      (friendId) => !friendId.equals(user._id)
    );
    // Update the user's friends array
    user.friends = uniqueFriends;
    await user.save();
  }

  console.log('Database seeded!');
  process.exit(0);
});
