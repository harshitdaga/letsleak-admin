/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* BucketFilter: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.BucketFilter.events({
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
        $("#bucketFilterModal").modal('show');
    }
});

Template.BucketFilter.helpers({

    status: function () {
        return Session.get(sessionKey.FILTER_DATA_READY);
    },
    bucketFilterList: function () {
        return AppCollection.Local.find(
            {"f_local_type": bucketFilter.f_local_type}
        );
    },
    confirmationHeader: function () {
        return Session.get(sessionKey.MODAL_CONFIRMATION_ACTION);
    },
    confirmationContent: function () {
        return Session.get(sessionKey.MODAL_CONFIRMATION_CONTENT);
    }
});


var BucketFilter = function BucketFilter() {
};
BucketFilter.prototype = {
    constructor: BucketFilter,
    f_local_type: "BUCKET",
    fetch: function () {
        Session.setDefault(sessionKey.FILTER_DATA_READY, false);
        var self = this;
        App.extensions._call("/filter/data", {limit: 1, key: bucketFilter.f_local_type}, self.fetchHandler);
    },

    fetchHandler: function (error, result) {
        Session.set(sessionKey.FILTER_DATA_READY, true);
        log.debug("fetchHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            App.extensions._showAlert(error);
            return;
        }
        try {
            AppCollection.Local.remove({"f_local_type": bucketFilter.f_local_type});
            _.forEach(result, function (i) {
                AppCollection.Local.insert(_.extend(i, {
                    "f_local_type": bucketFilter.f_local_type
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
            return false;
        }
        var data = {
            action: Session.get(sessionKey.MODAL_CONFIRMATION_ACTION),
            filterId: content[0]._id,
            key: bucketFilter.f_local_type,
            content: content[0],
            reason : reason
        };
        log.debug("resolve data:" + AppCommon._toJSON(data));
        App.extensions._call("/filter/resolve", data, bucketFilter.resolveHandler);
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
        $("#bucketFilterModal").modal('hide');
        Session.set(sessionKey.MODAL_CONFIRMATION_CONTENT, null);
        Session.set(sessionKey.MODAL_CONFIRMATION_ACTION, null);
        AppCollection.Local.remove({"_id": content._id});
    }
};

var bucketFilter = new BucketFilter();
var log = new AppLogger("BucketFilter");
var sessionKey = {
    "FILTER_DATA_READY": "FILTER_DATA_READY",
    "MODAL_CONFIRMATION_ACTION": "MODAL_CONFIRMATION_ACTION",
    "MODAL_CONFIRMATION_CONTENT": "MODAL_CONFIRMATION_CONTENT"
};
var reason = "";
/*****************************************************************************/
/* BucketFilter: Lifecycle Hooks */
/*****************************************************************************/
Template.BucketFilter.created = function () {
};

Template.BucketFilter.rendered = function () {
    bucketFilter.fetch();
    $("#bucketFilterModal").modal('setting', {
        onApprove: bucketFilter.resolve,
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

Template.BucketFilter.destroyed = function () {
};


