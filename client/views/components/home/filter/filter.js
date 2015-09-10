/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/

/*****************************************************************************/
/* Filter: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.Filter.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
    'click .checkbox input' : function(event,selector){
        Session.set(sessionTemplate,event.currentTarget.value);
    }
});

Template.Filter.helpers({
    template: function(){
        return Session.get(sessionTemplate);
    }
});

var Filter = function Filter(){};

Filter.prototype = {
    constructor : Filter,
    templates : {
        "STATUS" : "StatusFilter",
        "COMMENT" : "CommentFilter",
        "BUCKET" : "BucketFilter"
    }
};

var filter = new Filter();
var log = new AppLogger("Filter");
var sessionTemplate = "filterTemplate";
/*****************************************************************************/
/* Filter: Lifecycle Hooks */
/*****************************************************************************/
Template.Filter.created = function () {
};

Template.Filter.rendered = function () {
    Session.setDefault(sessionTemplate,filter.templates.STATUS);
};

Template.Filter.destroyed = function () {
    delete Session.keys[sessionTemplate];
};


