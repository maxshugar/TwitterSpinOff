UserUtils = function() {};    //no var in front

//find users that username is following
UserUtils.findFollowings = function(username) {  
  var currentFollowings = relationships.find({
    follower: username
  }).fetch().map(function(data) {
    return data.following;
  });
  currentFollowings.push(Meteor.user().username);

  return currentFollowings;
};