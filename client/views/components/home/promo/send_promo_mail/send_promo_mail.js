/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* : Event Handlers and Helpersss SendPromoMail.js*/
/*****************************************************************************/
Template.SendPromoMail.events({
    'mouseenter .sendInviteSingle': function (event, selector) {
        $(event.currentTarget).addClass("green");
    },

    'mouseleave .sendInviteSingle': function (event, selector) {
        $(event.currentTarget).removeClass("green");
    },

    'click .sendMailSingle': function (event, selector) {
        $(event.currentTarget).removeClass("green red").addClass("loading disabled").prop('disabled', true);
        sendMail.sendMail(event, selector);
    },
});

Template.SendPromoMail.helpers({
    pendingInvitationExist: function () {
        var result = AppCollection.Local.find({"f_local_type": sendMail.localType});
        return result.count() > 0;
    },
    accountList: function () {
        return AppCollection.Local.find({"f_local_type": sendMail.localType});
    },
    convert : function(emailId){
        emailId = emailId.replace("@","_");
        emailId = emailId.replace(".","_");
        return emailId;
    }
});


var SendMailModel = function PromoModel() {
    this.localType = "PROMO_MAIL_ACCOUNTS"
};

SendMailModel.prototype = {
    constructor: SendMailModel,

    getPromoAccountHandler : function(error,result){
        log.debug("getPromoAccountHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            App.extensions._showAlert(error);
            return;
        }
        try {
            AppCollection.Local.remove({"f_local_type": sendMail.localType});
            _.forEach(result, function (i) {
                AppCollection.Local.insert(_.extend(i, {
                    "f_local_type": sendMail.localType
                }));
            });
        } catch (error) {
            log.error("Error occurred while parsing pending account");
            log.error(error);
        }
    },

    sendMail : function(event,selector){
        var self = this;
        var emailId = event.currentTarget.getAttribute("emailId");
        var data = {
            emailId: emailId
        };
        log.debug("sendMail data:" + AppCommon._toJSON(data));
        App.extensions._call("/promo/sendMail", data, function (error, result) {
            log.debug("sendMailHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            $(event.currentTarget).removeClass("loading disabled").prop('disabled', false);
            if (error) {
                $(event.currentTarget).addClass("red");
                App.extensions._showAlert(error);
                return;
            }
            sendMail.disableRow(emailId);
        });
    },

    disableRow: function (emailId) {
        emailId = emailId.replace("@","_");
        emailId = emailId.replace(".","_");

        $("#" + emailId).addClass("disabled").prop("disabled", true);
        $("input[value=" + emailId + "]").removeAttr("checked").prop("disabled", true);
        //$("input[value=" + inviteCode + "]").prop("disabled", true);
    }
};
var log = new AppLogger("SendPromoMail");
var sendMail = new SendMailModel();

/*****************************************************************************/
/* : Lifecycle Hooks */
/*****************************************************************************/
Template.SendPromoMail.created = function () {
};

Template.SendPromoMail.rendered = function () {
    var data = {
        limit : 1,
        type : "NOT_SENT"
    };
    App.extensions._call("/promo/getPromoAccount", data, function (error, result) {
        sendMail.getPromoAccountHandler(error, result);
    });
};

Template.SendPromoMail.destroyed = function () {
};


