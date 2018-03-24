import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
  relationships._ensureIndex({follower: 1, following: 1}, {unique: 1});
});

Meteor.methods({
  'deleteTweet': function(id) {
    tweets.remove(id);
  },
  'updateTweet': function(update_id, tweet) {
    tweets.update(update_id, {
		$set: { text: tweet },
	});
  },
  'addTweet': function(tweet, user_id, username, createdAt) {
    tweets.insert({ text: tweet, user_id: user_id, username: username, createdAt: createdAt });
  }
});