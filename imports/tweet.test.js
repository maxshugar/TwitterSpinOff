import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';

if(Meteor.isServer){
	describe('my module', function () {
	  it('does something that should be tested', function () {
		
		expect(true).to.be.false;
		
	  })
	})
}