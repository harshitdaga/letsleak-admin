/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* HomeLayout: Event Handlers and Helpers */
/*****************************************************************************/
Template.HomeLayout.events({
    "click #signOut" : function(event,selector){
        App.extensions._clearSession();

    }
});

Template.HomeLayout.helpers({

});

Template.Header.helpers({
    agentName: function(){
        return App.extensions._getUserId();
    }
});

/*****************************************************************************/
/* HomeLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.HomeLayout.created = function () {
};

Template.HomeLayout.rendered = function () {
     $('.ui.dropdown').dropdown(("settings",{
         on : "hover"
     }));

};

Template.HomeLayout.destroyed = function () {
    $('.ui.dropdown').dropdown('destroy');
};
