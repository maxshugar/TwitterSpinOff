import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Mongo } from 'meteor/mongo'
import './main.html';

if (Meteor.isClient){
	
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
			  $('#tweetText').val("");
			  Session.set('numChars', 0);
			  //Tweets.insert({message: tweet});
			}
	});
	
	Template.tweetBox.helpers({
		charCount: function() {
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
	
	Template.tweetFormModal.onRendered(function(){
		$('.tweet-form-modal').validate({
			rules: {
				tweet: {
					required: true,
					maxlength: 140
				}
			}
		});
	});
	
	Template.dashboard.onRendered(function(){
		$('.tweet-form-modal-update').validate({
			rules: {
				tweet: {
					required: true,
					maxlength: 140
				}
			}
		});
	});
	
	function submitTweet(data){
		tweets.insert({ text: data, user_id: Meteor.user()._id, email: Meteor.user().emails[0].address, createdAt: Date.now() });
	}
	
	Template.registerHelper('formatTime', function(createdAt) {
	  return moment(createdAt).fromNow();
	});
	
	Template.registerHelper('formatDate', function(data) {
	  return moment(data).format('MM-DD-YYYY h:m:s');
	});
	
	Template.registerHelper('isCurrentUser', function(username) {
			if(username == Meteor.user().emails[0].address){
				return true;
			}
			else{
				return false;
			}
	});
	
	Template.dashboard.helpers({
		tweets: function(){
			return tweets.find({}, {
				sort: { createdAt: -1 }
			});
		}
	});
	
	/* OLD
	Template.tweetForm.events({
		'submit .tweet-form' : function(e){
			e.preventDefault();
			submitTweet(e.target.tweet.value);
			e.target.tweet.value = '';
	  },
	  'keyup .tweet-form [name="tweet"]' : function(e){
			var availableCharCount = 140 - e.target.value.length;
			$('.char-count').text(availableCharCount);
	  }
	});
	*/
	
	Template.tweetBox.events({
		'submit .tweet-form' : function(e){
			e.preventDefault();
			alert(1);
	  }
	});
	
	Template.tweetFormModal.events({
		'submit .tweet-form-modal' : function(e){
			e.preventDefault();
			submitTweet(e.target.tweet.value);
			$('#tweetModal .tweet-form-modal')[0].tweet.value = '';
	  },
	  'keyup .tweet-form-modal [name="tweet"]' : function(e){
			var availableCharCount = 140 - e.target.value.length;
			$('.char-count-modal').text(availableCharCount);
		}
	});
	
	Template.dashboard.events({
		'click .add-tweet-btn' : function(){
			$('#tweetModal').modal();
			$('#tweetModal .modal-body').clone($('.tweet-form'));
		},
		'click .submit-tweet-btn' : function(e){
			e.preventDefault();
			if($('.tweet-form-modal').valid()){
				submitTweet($('#tweetModal .tweet-form-modal')[0].tweet.value);
			}
			$('#tweetModal .tweet-form-modal')[0].tweet.value = '';
		},
		'click .update-tweet-btn' : function(e){
			e.preventDefault();
			var update_id = document.getElementById("update_id").value;
			if($('.tweet-form-modal-update').valid()){
				 tweets.update(update_id, {
				  $set: { text: $('#updateModal .tweet-form-modal-update')[0].tweet.value },
				});
				$('#updateModal').modal('hide');
			}
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
					swal({
						title: 'Deleted!',
						text: 'Your tweet was successfully deleted!',
						type: 'success'
					}, function() {
						tweets.remove(id);
					});
				} else {
					swal("Cancelled", "Your tweet is safe :)", "error");
				}
			});
		},
		'click .update-btn' : function(e){
			e.preventDefault();
			$('#updateModal').modal();
			document.getElementById("updateTextBox").value = this.text; 
			document.getElementById("update_id").value = this._id;
			$('.char-count-modal-update').text(140 - this.text.length);
		},
		'submit .tweet-form-modal-update' : function(e){
			e.preventDefault();
			var update_id = document.getElementById("update_id").value;
			tweets.update(update_id, {
				$set: { text: $('#updateModal .tweet-form-modal-update')[0].tweet.value },
			});
			$('#updateModal').modal('hide');
		},
		'keyup .tweet-form-modal-update [name="tweet"]' : function(e){
			var availableCharCount = 140 - e.target.value.length;
			$('.char-count-modal-update').text(availableCharCount);
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