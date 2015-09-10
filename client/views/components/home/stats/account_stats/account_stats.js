/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* AccountStats: Event Handlers and Helpers .js*/
/*****************************************************************************/
Template.AccountStats.events({

    'click #reloadButton': function (event, selector) {
        accountStats.getInvitedAccount();
    },
    'click #showMoreButton': function (event, selector) {
        var currentLimit = Session.get(sessionKeys.ACCOUNT_INVITE_FETCH_COUNT);
        var currentDocCount = AppCollection.Local.find({"f_local_type": accountStats.f_local_type}).count();
        if (currentLimit * AppLimit.STATS_ACCOUNT <= currentDocCount) {
            currentLimit++;
            Session.set(sessionKeys.ACCOUNT_INVITE_FETCH_COUNT, currentLimit);
        }
        accountStats.getInvitedAccount();
    },

    'click .resendInvite': function (event, selector) {
        $(event.currentTarget).removeClass("red").addClass("loading disabled").prop('disabled', true);
        accountStats.resendInvite(event, selector);
    },

});

Template.AccountStats.helpers({
    dataReady: function () {
        return Session.get(sessionKeys.DATA_READY);
    },
    sendInviteList: function () {
        return AppCollection.Local.find(
            {"f_local_type": accountStats.f_local_type}
        );
    },
    mailResendCount : function(){
        var self = this;
        var count = self.f_mail_resend_count;
        return !AppCommon._isEmpty(count) && count > 0 ? count : 0;
    }
});

//making it global so that can be used by controller
AccountStatsModel = function AccountStatsModel() {
};
AccountStatsModel.prototype = {
    constructor: AccountStatsModel,
    f_local_type: "INVITED_ACCOUNT_STATS",
    getInvitedAccount: function () {
        Session.set(sessionKeys.DATA_READY, false);
        App.extensions._call("/stats/account/getInvitedAccounts", {limit: Session.get(sessionKeys.ACCOUNT_INVITE_FETCH_COUNT)}, this.getInvitedAccountHandler);
    },

    getInvitedAccountHandler: function (error, result) {
        Session.set(sessionKeys.DATA_READY, true);
        log.debug("getInvitedAccountHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            App.extensions._showAlert(error);
            return;
        }
        try {
            AppCollection.Local.remove({"f_local_type": accountStats.f_local_type});
            _.forEach(result, function (i) {
                AppCollection.Local.insert(_.extend(i, {
                    "f_local_type": accountStats.f_local_type
                }));
            });
        } catch (error) {
            log.error("Error occurred while parsing invited account");
            log.error(error);
        }
    },

    resendInvite: function (event, selector) {
        var self = this;
        var emailId = event.currentTarget.getAttribute("emailId");
        var inviteCode = event.currentTarget.getAttribute("inviteCode");
        var data = {
            emailId: emailId,
            inviteCode: inviteCode
        };
        log.debug("resendInvite data:" + AppCommon._toJSON(data));
        App.extensions._call("/invitation/account/resendInvite", data, function (error, result) {
            log.debug("sendInvite error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            $(event.currentTarget).removeClass("loading disabled").prop('disabled', false);
            if (error) {
                $(event.currentTarget).addClass("red");
                App.extensions._showAlert(error);
                return;
            }
            $(event.currentTarget).addClass('teal');
        });
    }
};
var log = new AppLogger("AccountStats");
var accountStats = new AccountStatsModel();
var sessionKeys = {
    "ACCOUNT_INVITE_FETCH_COUNT": "ACCOUNT_INVITE_FETCH_COUNT",
    "DATA_READY": "ACCOUNT_STATS_DATA_READY"
};

/*****************************************************************************/
/* AccountStats: Lifecycle Hooks */
/*****************************************************************************/
Template.AccountStats.created = function () {
};

Template.AccountStats.rendered = function () {
    Session.setDefault(sessionKeys.ACCOUNT_INVITE_FETCH_COUNT, 1);
    Session.setDefault(sessionKeys.DATA_READY, true);
};

Template.AccountStats.destroyed = function () {
    App.extensions._deleteSessionKeys([sessionKeys.ACCOUNT_INVITE_FETCH_COUNT, sessionKeys.DATA_READY]);
    AppCollection.Local.removeLocalType(accountStats.f_local_type);
};


