import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Mongo } from 'meteor/mongo'
import './main.html';

if (Meteor.isClient){
	Template.newsFeed.onCreated(function() {  
		this.subscribe('tweets', Meteor.user().username);
		this.subscribe('ownTweets', Meteor.user().username);
	});
	
	function updateTrending(){
		if(tweets){
			 Meteor.call('getTrending', function(error, result) {
				Session.set('trending_', result);
			});
		}
	}
	
	/*************************** USER MANAGEMENT ***************************************/
	Template.userManagement.onCreated( function() {
		if (Meteor.user()) {
		 Meteor.subscribe('relationships');
	  }
	});
	
	Template.userManagement.helpers({
	  'tweets': function() {
		if (Meteor.user()) {
		  return tweets.find({ username: Meteor.user().username }).count();
		}
	  },
	  'following': function() {
		if (Meteor.user()) {
		  return relationships.find({ follower: Meteor.user().username }).count();
		}
	  },
	  'followers': function() {
		if (Meteor.user()) {
		  return relationships.find({ following: Meteor.user().username }).count();
		}
	  }
	});	
	
	Template.followUsers.helpers({
  'foundUser': function() {
    return Session.get('foundUser');
  },
  'recommendedUsers': function() {
    if (Meteor.user()) {
      var currentFollowings = UserUtils.findFollowings(Meteor.user().username);
      var recUsers = Meteor.users.find({
        username: {
          $nin: currentFollowings
        }
      }, {
        fields: { 'username': 1 },
        limit: 5
      }).fetch();
      return recUsers;
    }
  }
});

Template.followUsers.events({
  'click #follow': function() {
    Meteor.call('followUser', Session.get('foundUser').username);
  },
  'click #followRec': function(event) {
    Meteor.call('followUser', this.username);
  }
});

Template.followUsers.onCreated(function() {
  if (Meteor.user()) {
    this.subscribe('users', Meteor.user().username)
    this.subscribe('followings', Meteor.user().username);
  }
});
	/*************************** ADD TWEET MODAL ***************************************/
	
	Template.addTweetModal.onRendered(function () {  
	  Session.set('numChars_', 0);
	});
	
	Template.addTweetModal.events({  
		'input #modal_tweetText': function(){
			Session.set('numChars_', $('#modal_tweetText').val().length);
		  },
		  'click .add-btn': function() { 
			  var tweet = $('#modal_tweetText').val();
			  var user_id =  Meteor.user()._id;
			  var username = Meteor.user().username;
			  var createdAt = Date.now();
			  Meteor.call('addTweet', tweet, user_id, username, createdAt);
			  updateTrending();
			  $('#modal_tweetText').val("");
			  Session.set('numChars_', 0);
			  $('#tweetModal').modal('hide');
			}
	});
	
	Template.addTweetModal.helpers({	
		charCount: function() {
			return 140 - Session.get('numChars_');
		},
		charClass: function() {
			if (Session.get('numChars_') > 140) {
				return 'errCharCount';    //css class name
			} else {
				return 'charCount';       //css class name
			}
		},
		disableButton: function() {
			if (Session.get('numChars_') <= 0 || Session.get('numChars_') > 140) {
				return 'disabled';
			}
		}
	});
	
	/****************************** TWEET BOX ******************************************/
	
	Template.tweetBox.onRendered(function () {  
	  Session.set('numChars', 0);
	});
	
	Template.tweetBox.events({  
		'input #tweetText': function(){
			Session.set('numChars', $('#tweetText').val().length);
		  },
		  'click button': function() {
			  var tweet = $('#tweetText').val();
			  var user_id =  Meteor.user()._id;
			  var username = Meteor.user().username;
			  var createdAt = Date.now();
			  Meteor.call('addTweet', tweet, user_id, username, createdAt);
			  $('#tweetText').val("");
			  Session.set('numChars', 0);
			  updateTrending();
			}
	});
	
	Template.tweetBox.helpers({
		charCount: function(){
			return 140 - Session.get('numChars');
		},
		charClass: function() {
			if (Session.get('numChars') > 140) {
				return 'errCharCount';    //css class name
			} else {
				return 'charCount';       //css class name
			}
		},
		disableButton: function() {
			if (Session.get('numChars') <= 0 || Session.get('numChars') > 140) {
				return 'disabled';
			}
		}
	});
	
	/***************************** HELPERS **********************************/
	
	Template.registerHelper('formatTime', function(createdAt) {
	  return moment(createdAt).fromNow();
	});
	
	Template.registerHelper('formatDate', function(data) {
	  return moment(data).format('MM-DD-YYYY h:m:s');
	});
	
	Template.registerHelper('isCurrentUser', function(username) {
			if(username == Meteor.user().username){
				return true;
			}
			else{
				return false;
			}
	});
	
	Template.newsFeed.helpers({
		tweets: function(){
			return tweets.find({}, {
				sort: { createdAt: -1 }//,
				//limit: 10
			});
		},
		charCount: function() {
			return 140 - Session.get('numChars__');
		},
		charClass: function() {
			if (Session.get('numChars__') > 140) {
				return 'errCharCount';    //css class name
			} else {
				return 'charCount';       //css class name
			}
		},
		disableButton: function() {
			if (Session.get('numChars__') <= 0 || Session.get('numChars__') > 140) {
				return 'disabled';
			}
		},
		trends: function(){
			return Session.get("trending_");
		}
	});
	
	/************************** News Feed **************************************************/
	
	Template.newsFeed.onRendered(function () {  
	  Session.set('numChars__', 0);
		updateTrending();
	});
	
	Template.newsFeed.events({
		'submit form': function(event) {
    var searchUser = event.target.searchUser.value;
    var foundUser = Meteor.call('findUser', searchUser, function(err, res) {
      if (res){
		  Session.set('foundUser', res);
	  }
	  else{
		  Session.set('foundUser', null);
	  }
	});
    return false;
  },
		'click .add-tweet-btn' : function(){
			$('#tweetModal').modal();
		},
		'input #update_tweetText': function(){
			Session.set('numChars__', $('#update_tweetText').val().length);
		},
		'click #update-tweet' : function(e){
			e.preventDefault();
			var update_id = document.getElementById("update_id").value;
			var tweet = $('#update_tweetText').val();
			Meteor.call('updateTweet', update_id, tweet);
			$('#updateModal').modal('hide');
			updateTrending();
		},
		'click .delete-btn' : function(e){
			e.preventDefault();
			var id = this._id;
			 swal({
				title: "Are you sure?",
				text: "You will not be able to recover this tweet!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: '#DD6B55',
				confirmButtonText: 'Yes, I am sure!',
				cancelButtonText: "No, cancel it!",
				closeOnConfirm: false,
				closeOnCancel: false
			},
			function(isConfirm) {
				if (isConfirm) {
					Meteor.call('deleteTweet', id);
					updateTrending();
					swal({
						title: 'Deleted!',
						text: 'Your tweet was successfully deleted!',
						type: 'success'
					}, function() {});
				} else {
					swal("Cancelled", "Your tweet is safe :)", "error");
				}
			});
		},
		'click .update-btn' : function(e){
			e.preventDefault();
			$('#updateModal').modal();
			document.getElementById("update_tweetText").value = this.text; 
			document.getElementById("update_id").value = this._id;
			Session.set('numChars__', $('#update_tweetText').val().length);
		},
		'click .unfollow-btn' : function(e){
			e.preventDefault();
			var follower = Meteor.user().username
			var following = this.username;
			Meteor.call('unfollowUser', follower, following);
		}
	});
	
	/****************************************USER LOGIN********************************/
	
	Template.body.onRendered(function() {
	  let settings = 'settings.json';
	  this.autorun(() => {
		if (particlesJS) {
		  console.log(`loading particles.js config from "${settings}"...`)
		  particlesJS.load('particles-js', settings, function () {
			console.log('callback - particles.js config loaded');
		  });
		}
	  });
	});
	
	Template.datetime.helpers({
	   currentTime : function() {
		   return Chronos.moment().format('MMM DD HH:mm:ss');
	   }
	});
	
	Template.welcomeMessage.helpers({
		message: function(){
			var split1 = Chronos.moment().format('MMM DD HH:mm:ss').split(':');
			var split2 = split1[0].split(' ');
			if(split2[2] < 12){
			   return "Good Morning";
			}
			if(split2[2] >= 12 && split2[2] < 18){
			   return "Good Afternoon";
			}
			if( split2[2] >= 18 ){
			   return "Good Evening";
			}
		}
	});
	
	Template.body.helpers({
		showLogin:function() {
			return Session.get('showLogin');
		}
	});
	
	$.validator.setDefaults({
		rules: {
			loginUsername: {
				required: true
			},
			loginPassword: {
				required: true,
				minlength: 6
			},
			registerUsername: {
				required: true
			},
			registerPassword: {
				required: true,
				minlength: 6
			},
			registerPassword_: {
				required: true,
				minlength: 6,
				equalTo: "#password"
			}
		},
		messages: {
			loginUsername: {
				required: "You must enter an username.",
				username: "You've entered an invalid username."
			},
			loginPassword: {
				required: "You must enter a password.",
				minlength: "Your password must be at least {0} characters."
			},
			registerUsername: {
				required: "You must enter a username address.",
				username: "You've entered an invalid username address."
			},
			registerPassword: {
				required: "You must enter a password.",
				minlength: "Your password must be at least {0} characters."
			},
			registerPassword_: {
				equalTo: "Passwords do not match",
				required: "You must enter a password.",
				minlength: "Your password must be at least {0} characters."
			}
		}
	});
	
	Template.login.onRendered(function(){
		var validator = $('#LoginForm').validate({
			submitHandler: function(event){
				var username = $('[name=loginUsername]').val();
				var password = $('[name=loginPassword]').val();
				Meteor.loginWithPassword(username, password, function(error){
					if(error){
						if(error.reason == "User not found"){
							validator.showErrors({
								loginUsername: "That username doesn't belong to a registered user."   
							});
						}
						if(error.reason == "Incorrect password"){
							validator.showErrors({
								loginPassword: "You entered an incorrect password."    
							});
						}
					}
				});
			}
		});
	});
	
	Template.register.onRendered(function(){
		var validator = $('#RegisterForm').validate({
			submitHandler: function(event){
				var username = $('[name=registerUsername]').val();
				var password = $('[name=registerPassword]').val();
				Accounts.createUser({
					username: username,
					password: password
				}, function(error){
					if(error){
						if(error.reason == "Username already exists."){
							validator.showErrors({
								registerUsername: "That username already belongs to a registered user."   
							});
						}
					}
					else{
						Session.set('showLogin', false);
					}
				});
			}
		});
	});
	
	Template.register.events({
		'submit form': function(event){
			event.preventDefault();
		},
		'click #ToggleLogin': function(event){
			event.preventDefault();
			Session.set('showLogin', false);
		}
	});
	
	Template.login.events({
		'submit form': function(event){
			event.preventDefault();
		},
		'click #ToggleRegister': function(event){
			event.preventDefault();
			Session.set('showLogin', true);
		}
	});
	Template.newsFeed.events({
		'click .logout': function(event){
			event.preventDefault();
			Meteor.logout();
		}
	});
}