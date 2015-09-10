/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* CommentFilter: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.CommentFilter.events({
    'click .invalidComment, click .validComment': function (event, selector) {
        var id = $(event.currentTarget).attr("value");
        var action = $(event.currentTarget).attr("action");
        action = AppCommon._isEmpty(action) ? action : action.toUpperCase();
        var header = "";

        switch (action) {
            case "VALID" :
                header = "VALID";
                break;
            case "INVALID" :
                header = "INVALID";
                break;
            default :
                break;
        }

        var data = AppCollection.Local.find({"_id": id});
        Session.set(sessionKey.MODAL_CONFIRMATION_CONTENT, data.fetch());
        Session.set(sessionKey.MODAL_CONFIRMATION_ACTION, header);
        $("#commentFilterModal").modal('show');
    }
});

Template.CommentFilter.helpers({

    status: function () {
        return Session.get(sessionKey.STATUS_FILTER_READY);
    },
    commentFilterList: function () {
        return AppCollection.Local.find(
            {"f_local_type": commentFilter.f_local_type}
        );
    },
    confirmationHeader: function () {
        return Session.get(sessionKey.MODAL_CONFIRMATION_ACTION);
    },
    confirmationContent: function () {
        return Session.get(sessionKey.MODAL_CONFIRMATION_CONTENT);
    }
});


var CommentFilter = function CommentFilter() {
};
CommentFilter.prototype = {
    constructor: CommentFilter,
    f_local_type: "STATUS_COMMENT",
    fetch: function () {
        Session.setDefault(sessionKey.STATUS_FILTER_READY, false);
        var self = this;
        App.extensions._call("/filter/data", {limit: 1, key: commentFilter.f_local_type}, self.fetchHandler);
    },

    fetchHandler: function (error, result) {
        Session.set(sessionKey.STATUS_FILTER_READY, true);
        log.debug("fetchHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            App.extensions._showAlert(error);
            return;
        }
        try {
            AppCollection.Local.remove({"f_local_type": commentFilter.f_local_type});
            _.forEach(result, function (i) {
                AppCollection.Local.insert(_.extend(i, {
                    "f_local_type": commentFilter.f_local_type
                }));
            });
        } catch (error) {
            log.error("Error occurred while parsing pending account");
            log.error(error);
        }
    },
    resolve: function () {
        var self = this;
        var content = Session.get(sessionKey.MODAL_CONFIRMATION_CONTENT);
        if(AppCommon._isEmpty(reason)){
            App.extensions._showAlert("Reason not selected.");
            return;
        }
        var data = {
            action: Session.get(sessionKey.MODAL_CONFIRMATION_ACTION),
            filterId: content[0]._id,
            key: commentFilter.f_local_type,
            content: content[0],
            reason : reason
        };
        log.debug("resolve data:" + AppCommon._toJSON(data));
        App.extensions._call("/filter/resolve", data, commentFilter.resolveHandler);
        return false;
    },
    resolveHandler: function (error, result) {
        log.debug("resolveHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            App.extensions._showAlert(error);
            return;
        }
        var content = Session.get(sessionKey.MODAL_CONFIRMATION_CONTENT);
        content = content[0];
        $("#commentFilterModal").modal('hide');
        Session.set(sessionKey.MODAL_CONFIRMATION_CONTENT, null);
        Session.set(sessionKey.MODAL_CONFIRMATION_ACTION, null);
        AppCollection.Local.remove({"_id": content._id});
    }
};

var commentFilter = new CommentFilter();
var log = new AppLogger("CommentFilter");
var sessionKey = {
    "STATUS_FILTER_READY": "STATUS_FILTER_READY",
    "MODAL_CONFIRMATION_ACTION": "MODAL_CONFIRMATION_ACTION",
    "MODAL_CONFIRMATION_CONTENT": "MODAL_CONFIRMATION_CONTENT"
};
var reason = "";
/*****************************************************************************/
/* CommentFilter: Lifecycle Hooks */
/*****************************************************************************/
Template.CommentFilter.created = function () {
};

Template.CommentFilter.rendered = function () {
    commentFilter.fetch();
    $("#commentFilterModal").modal('setting', {
        onApprove: commentFilter.resolve,
        transition: 'vertical flip',
        onShow : function(){
            reason = "";
            $("#reasonDropdown .dropdown").dropdown({
                onChange : function(value,text){
                    reason = text;
                }
            });
        }
    });
};

Template.CommentFilter.destroyed = function () {
};


