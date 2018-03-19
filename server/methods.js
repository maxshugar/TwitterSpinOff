import { Meteor } from 'meteor/meteor';

Meteor.publish('tweets', function() {  
  return tweets.find();
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
  'addTweet': function(tweet, user_id, email, createdAt) {
    tweets.insert({ text: tweet, user_id: user_id, email: email, createdAt: createdAt });
  }
});