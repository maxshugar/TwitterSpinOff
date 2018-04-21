import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { methods } from '/server/methods.js'
import { relationships } from '/lib/collections/relationships.js'
import { tweets } from '/lib/collections/tweets.js'
import { resetDatabase } from 'meteor/xolvio:cleaner';


if (Meteor.isServer) {
  describe('Tweets', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;
      beforeEach(() => {
        tweets.remove({});
        taskId = tweets.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });
		beforeEach(function () {
			resetDatabase();
		});
      it('deleteTweet', () => {
        const deleteTweet = Meteor.server.method_handlers['deleteTweet'];
        const invocation = { userId };
        deleteTweet.apply(invocation, [taskId]);
        assert.equal(tweets.find().count(), 0);
      });
	  it('addTweet', () => {
        const addTweet = Meteor.server.method_handlers['addTweet'];
        const invocation = { userId };
        addTweet.apply(invocation);
        assert.equal(tweets.find().count(), 1);
      });
    });
  });
}