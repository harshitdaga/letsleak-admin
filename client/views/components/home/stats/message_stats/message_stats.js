/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* MessageStats: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.MessageStats.events({
    'submit #messageSearchForm, click #submitButton': function (event, selector) {
        event.preventDefault();
        messageStat.getMessageDetails(event, selector);
        return false;
    }
});

Template.MessageStats.helpers({
    dataReady : function(){
        return Session.get(sessionKeys.DATA_READY);
    },

    messageDetails : function(){
        return Session.get(sessionKeys.MESSAGE);
    }
});

var MessageStat = function () {};
MessageStat.prototype = {
    constructor: MessageStat,
    f_local_type: "MESSAGE_STATS",
    getMessageDetails: function (event, selector) {
        var id = $("#postId").val();
        if(!AppCommon._isEmpty(id)){
            Session.set(sessionKeys.DATA_READY, false);
            Session.set(sessionKeys.MESSAGE,{});
            App.extensions._call("/stats/message/getStatusDetails", {"_id" : id}, this.getMessageDetailsHandler);
        }
    },
    getMessageDetailsHandler : function(error,result){
        log.debug("getMessageDetailsHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            App.extensions._showAlert(error);
            return;
        }
        if(!AppCommon._isEmpty(result)){
            Session.set(sessionKeys.MESSAGE,result);
        }
        Session.set(sessionKeys.DATA_READY,true);
    }
};
var log = new AppLogger("MessageStats");
var messageStat = new MessageStat();
var sessionKeys = {
    "MESSAGE": "MESSAGE",
    "DATA_READY": "MESSAGE_STATS_DATA_READY"
};

/*****************************************************************************/
/* MessageStats: Lifecycle Hooks */
/*****************************************************************************/
Template.MessageStats.created = function () {
};

Template.MessageStats.rendered = function () {
    Session.setDefault(sessionKeys.DATA_READY,true);
    Session.setDefault(sessionKeys.MESSAGE,"");
};

Template.MessageStats.destroyed = function () {
};


