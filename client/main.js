import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Mongo } from 'meteor/mongo'
import './main.html';

if (Meteor.isClient){
	
	/*******************************ADD TWEET******************************************/
	Template.tweetForm.onRendered(function(){
		$('.tweet-form').validate({
			rules: {
				tweet: {
					required: true,
					maxlength: 140
				}
			}
		});
	});
	
	function submitTweetForm(data){
		tweets.insert({ text: data, user_id: Meteor.user()._id, email: Meteor.user().emails[0].address, createdAt: Date.now() });
	}
	
	Template.registerHelper('formatTime', function(createdAt) {
	  //return moment(createdAt).format('MM-DD-YYYY');.fromNow();
	  return moment(createdAt).fromNow();
	});
	
	Template.registerHelper('formatDate', function(data) {
	  return moment(data).format('MM-DD-YYYY h:m:s');
	  //return moment(createdAt).fromNow();
	});
	
	Template.dashboard.helpers({
		tweets: function(){
			return tweets.find({}, {
				sort: { createdAt: -1 }
			});
		}
	});
	
	Template.tweetForm.events({
		'submit .tweet-form' : function(e){
			e.preventDefault();
			submitTweetForm(e.target.tweet.value);
	  },
	  'keyup .tweet-form [name="tweet"]' : function(e){
			var availableCharCount = 140 - e.target.value.length;
			$('.char-count').text(availableCharCount);
	  }
	});
	
	Template.dashboard.events({
		'click .add-tweet-btn' : function(){
			$('#tweetModal').modal();
			$('#tweetModal .modal-body').clone($('.tweet-form'));
		},
		'click .submit-tweet-btn' : function(e){
			e.preventDefault();
			submitTweetForm($('#tweetModal .tweet-form')[0].tweet.value);
		}
	});
	
	/****************************************USER LOGIN********************************/
	
	Template.body.onRendered(function() {
	  let settings = 'settings.json';
	  this.autorun(() => {
		if (particlesJS) {
		  console.log(`loading particles.js config from "${settings}"...`)
		  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
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
			if(split2[2] <= 12){
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
			loginEmail: {
				required: true,
				email: true
			},
			loginPassword: {
				required: true,
				minlength: 6
			},
			registerEmail: {
				required: true,
				email: true
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
			loginEmail: {
				required: "You must enter an email address.",
				email: "You've entered an invalid email address."
			},
			loginPassword: {
				required: "You must enter a password.",
				minlength: "Your password must be at least {0} characters."
			},
			registerEmail: {
				required: "You must enter an email address.",
				email: "You've entered an invalid email address."
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
				var email = $('[name=loginEmail]').val();
				var password = $('[name=loginPassword]').val();
				Meteor.loginWithPassword(email, password, function(error){
					if(error){
						if(error.reason == "User not found"){
							validator.showErrors({
								loginEmail: "That email doesn't belong to a registered user."   
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
				var email = $('[name=registerEmail]').val();
				var password = $('[name=registerPassword]').val();
				Accounts.createUser({
					email: email,
					password: password
				}, function(error){
					if(error){
						if(error.reason == "Email already exists."){
							validator.showErrors({
								registerEmail: "That email already belongs to a registered user."   
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
	Template.dashboard.events({
		'click .logout': function(event){
			event.preventDefault();
			Meteor.logout();
		}
	});
}