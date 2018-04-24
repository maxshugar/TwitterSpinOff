import { Meteor } from 'meteor/meteor';
//import { tweets } from '/lib/collections/tweets.js'

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
  },
   'getTrending': function() {
		var map = function() {
                var text = this.text;
				if (text) { 
					// quick lowercase to normalize per your requirements
					text = text.toLowerCase().split(" "); 
					for (var i = text.length - 1; i >= 0; i--) {
						// might want to remove punctuation, etc. here
						if (text[i])  {      // make sure there's something
						   emit(text[i], 1); // store a 1 for each word
						}
					}
				}
            }

            var reduce = function(key, values) {
               var count = 0;    
				values.forEach(function(v) {            
					count +=v;    
				});
				return count;
            }

            // keep in mind that executing the mapReduce function will override every time the collection Tags
            var result = tweets.mapReduce(map, reduce, {query: {}, out: "Tags", verbose: true});

            // now return all the tags, ordered by usage
            return Tags.find({ _id : /#/i } , { sort: {'value': -1}, limit: 5}).fetch();
			//, {limit : 3}
  }
});


  

