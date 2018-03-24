Meteor.methods({
  'findUser': function(username) {
    return Meteor.users.findOne({
      username: username
    }, {
      fields: {
        'username': 1
      }
    });
  },
  'followUser': function(username) {
    relationships.insert({
      follower: Meteor.user().username,
      following: username
    });
  },
  'unfollowUser': function(follower, following) {
    relationships.remove({
      follower: follower,
      following: following
    });
  }
});
