/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/

/*****************************************************************************/
/* Index: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.Index.events({
  'click #loginButton' : function(event,selector){
      var username = $("#username").val();
      var password = $("#password").val();

      if(AppCommon._isEmpty(username) || AppCommon._isEmpty(password)){
          App.extensions._showAlert("username or password is blank");
      }else{
          username = username.toLowerCase();
          if( (_.isEqual(username,"kiran") && _.isEqual(password,"kiran!123")) || (_.isEqual(username,"harshit") && _.isEqual(password,"harshit@123"))){
              App.extensions._setSession({userId:username, session:"validsession"});
              Router.go("home");
          }else{
              App.extensions._showAlert("Incorrect");
          }
      }

  }
});

Template.Index.helpers({});

/*****************************************************************************/
/* Index: Lifecycle Hooks */
/*****************************************************************************/
Template.Index.created = function () {
};

Template.Index.rendered = function () {
};

Template.Index.destroyed = function () {
};


