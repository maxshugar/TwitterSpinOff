Meteor.publishComposite('tweets', function(username) {
  return {
    find: function() {
      // Find the current user's following usersz
      return relationships.find({ follower: username });
    },
    children: [{
      find: function(relationship) {
        // Find tweets from followed users
        return tweets.find({username: relationship.following});
      }
    }]
  }
});

Meteor.publish('relationships', function () {
	return relationships.find({});
});

Meteor.publish('ownTweets', function(username) {
  return tweets.find({username: username});
});

Meteor.publish('users', function(username) {
  return Meteor.users.find({}, {
    fields: { 'username': 1 },
    limit: 100
  });
});
