/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Invitation: Event Handlers and Helpers */
/*****************************************************************************/
Template.AccountInvitation.events({

    'mouseenter .sendInviteSingle': function (event, selector) {
        $(event.currentTarget).addClass("green");
    },

    'mouseleave .sendInviteSingle': function (event, selector) {
        $(event.currentTarget).removeClass("green");
    },

    'click .sendInviteSingle': function (event, selector) {
        $(event.currentTarget).removeClass("green red").addClass("loading disabled").prop('disabled', true);
        accountInvite.sendInvite(event, selector);
    },

    'click #reloadButton': function (event, selector) {
        accountInvite.getPendingAccount();
    },

    'click #showMoreButton': function (event, selector) {
        var currentLimit = Session.get("pendingInvitationCount");
        var currentDocCount = AppCollection.Local.find({"f_local_type": "PENDING_ACCOUNT_INVITATION"}).count();
        if (currentLimit * 5 <= currentDocCount) {
            currentLimit++;
            Session.set("pendingInvitationCount", currentLimit);
        }
        accountInvite.getPendingAccount();
    },

    'click #multipleMode': function (event, selector) {
        var $multiMode = $("#multipleMode");
        var state = $multiMode.data("isOpened");
        if (!state) {
            $multiMode.data("isOpened", true);
            $("#sendInviteMultiple").removeClass("hide");
            $("#reloadButton").addClass("disabled").prop('disabled', true);
            $("#showMoreButton").addClass("disabled").prop('disabled', true);

            $(".pendingEmailIdCheckBox").removeClass("hide");
            $(".sendInviteSingle").addClass("disabled").prop('disabled', true);

        } else {
            $multiMode.data("isOpened", false);
            $("#sendInviteMultiple").addClass("hide");
            $("#reloadButton").removeClass("disabled").prop('disabled', false);
            $("#showMoreButton").removeClass("disabled").prop('disabled', false);
            $(".pendingEmailIdCheckBox").addClass("hide");

            //removing disable only for checkboxes which are not disabled
            //as disabled checkbox means mail already sent
            _.forEach($(".pendingEmailIdCheckBox"), function (item) {
                if (!_.isEqual(item.id, "allIds") && !$(item).is(":disabled")) {
                    $("#" + item.value).removeClass("disabled").prop('disabled', false);
                }
            });
        }
    },

    "click #allIds": function (event, selector) {
        var id = event.currentTarget.id;
        var state = $("#allIds").is(":checked");
        _.forEach($(".pendingEmailIdCheckBox"), function (item) {
            if (!$(item).is(":disabled")) {
                $(item).prop("checked", state);
            }
        });

        /*if(!state){
         $(".pendingEmailIdCheckBox").prop("checked",false);
         } else {
         $(".pendingEmailIdCheckBox").prop("checked",true);
         }*/
    },

    "click #sendInviteMultiple": function (event, selector) {
        var i = 1;
        var selectedElm = $("input:checked");
        var invitationList = _.map(selectedElm, function (item) {
            if (!_.isEqual(item.id, "allIds")) {
                return {
                    "emailId": item.id,
                    "inviteCode": item.value
                }
            }
        });
        _.uniq(_.compact(invitationList));
        if (!AppCommon._isEmpty(invitationList)) {
            accountInvite.sendMultipleInvite(invitationList);
        } else {
            App.extensions._showAlert("Please select atleast one mailId");
        }
    }
});

Template.AccountInvitation.helpers({
    pendingInvitationExist: function () {
        var result = AppCollection.Local.find({"f_local_type": "PENDING_ACCOUNT_INVITATION"});
        return result.count() > 0;
    },

    accountList: function () {
        return AppCollection.Local.find(
            {"f_local_type": "PENDING_ACCOUNT_INVITATION"}
        );
    },

    enableTableSort : function(){
        log.debug("enableTableSort");
        $('#inviteTable').tablesort();
    }
});


//making it global so that can be used by controller
AccountInvitationModel = function AccountInvitationModel() {
    this.emailTemplates = "CREATE_ACCOUNT"
};
AccountInvitationModel.prototype = {
    constructor: AccountInvitationModel,

    getPendingAccount: function () {
        $("#reloadLoader").removeClass("hide").addClass("dimmer");
        App.extensions._call("/invitation/account/getPendingAccount", {limit: Session.get("pendingInvitationCount")}, this.getPendingAccountHandler);
    },

    getPendingAccountHandler: function (error, result) {
        $("#reloadLoader").addClass("hide").removeClass("dimmer");
        log.debug("getPendingAccountHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            App.extensions._showAlert(error);
            return;
        }
        try {
            AppCollection.Local.remove({"f_local_type": "PENDING_ACCOUNT_INVITATION"});
            _.forEach(result, function (i) {
                AppCollection.Local.insert(_.extend(i, {
                    "f_local_type": "PENDING_ACCOUNT_INVITATION"
                }));
            });
        } catch (error) {
            log.error("Error occurred while parsing pending account");
            log.error(error);
        }
    },

    sendInvite: function (event, selector) {
        var self = this;
        var emailId = event.currentTarget.getAttribute("emailId");
        var inviteCode = event.currentTarget.getAttribute("inviteCode");
        var data = {
            emailId: emailId,
            inviteCode: inviteCode,
            template: self.emailTemplates
        };
        log.debug("sendInvite data:" + AppCommon._toJSON(data));
        App.extensions._call("/invitation/account/sendInvite", data, function (error, result) {
            log.debug("sendInvite error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            $(event.currentTarget).removeClass("loading disabled").prop('disabled', false);
            if (error) {
                $(event.currentTarget).addClass("red");
                App.extensions._showAlert(error);
                return;
            }
            accountInvite.disableInviteRow(emailId, inviteCode);
            AppCollection.Local.remove({_id:emailId});
        });
    },
    sendMultipleInvite: function (invitationList) {
        $("#sendInviteMultiple").addClass("loading disabled").prop('disabled', true);
        $("#allIds").prop("checked", false);
        var data = {
            "invitationList": invitationList,
            template: self.emailTemplates
        };
        log.debug("sendMultipleInvite invitationList:" + AppCommon._toJSON(data));
        App.extensions._call("/invitation/account/sendMultipleInvite", data, function (error, result) {
            log.debug("sendInvite error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            $("#sendInviteMultiple").removeClass("loading disabled").prop('disabled', false);
            if (error) {
                App.extensions._showAlert(error);
                return;
            }
            if (!AppCommon._isEmpty(result)) {
                _.forEach(result.success, function (item) {
                    accountInvite.disableInviteRow(item.emailId, item.inviteCode);
                });

                if (result.error) {
                    App.extensions._showAlert("Error occurred for some invitations");
                }
            }
        });
    },

    disableInviteRow: function (emailId, inviteCode) {
        $("#" + inviteCode).addClass("disabled").prop("disabled", true);
        $("input[value=" + inviteCode + "]").removeAttr("checked").prop("disabled", true);
        //$("input[value=" + inviteCode + "]").prop("disabled", true);
    }
};

var log = new AppLogger("AccountInvitation");
var accountInvite = new AccountInvitationModel();

/*****************************************************************************/
/* Invitation: Lifecycle Hooks */
/*****************************************************************************/
Template.AccountInvitation.created = function () {

};

Template.AccountInvitation.rendered = function () {
    $("#multipleMode").data("isOpened", false);

};

Template.AccountInvitation.destroyed = function () {
    AppCollection.Local.remove({"f_local_type": "PENDING_ACCOUNT_INVITATION"})
};