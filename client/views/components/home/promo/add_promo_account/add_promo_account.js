/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* : Event Handlers and Helpersss AddPromoAccount.js*/
/*****************************************************************************/
Template.AddPromoAccount.events({
    'change #bulkEmails': function (event, selector) {
        var isChecked = $("#bulkEmails").is(":checked");
        var $textArea = $("#addEmailForm textarea");
        var $inputBox = $("#addEmailForm input[type='text']");
        if (isChecked) {
            $textArea.removeAttr("disabled");
            $inputBox.attr("disabled", "disabled");
            $("#bulkEmailsField").removeClass("hide");
        } else {
            $textArea.attr("disabled", "disabled");
            $inputBox.removeAttr("disabled");
            $("#bulkEmailsField").addClass("hide");
        }
    },

    'click #addEmailButton': function (event, selector) {
        event.preventDefault();
        promo.hideError();
        promo.addEmail(event, selector);
    },

    "submit form": function (event, selector) {
        event.preventDefault();
        promo.hideError();
        promo.addEmail(event, selector);
        return false;
    }
});

Template.AddPromoAccount.helpers({

});


var PromoModel = function PromoModel() {
};

PromoModel.prototype = {
    constructor: PromoModel,

    addEmail: function (event, selector) {
        var self = this;
        var isChecked = $("#bulkEmails").is(":checked");
        var tmpEmailList = [];
        var value = "";
        var $textArea = $("#addEmailForm textarea");
        var $inputBox = $("#addEmailForm input[type='text']");

        if (isChecked) {
            //textarea
            value = $textArea.val();
            value = value.replace(/;/g,",");
            tmpEmailList = value.split(",");
        } else {
            //input box
            value = $inputBox.val();
            tmpEmailList.push(value);
        }

        var emailList = [];
        var invalidList = [];
        _.forEach(tmpEmailList, function (item) {
            if(!AppCommon._isEmpty(item)){
                var item = item.trim();
                if (self.isValidEmail(item)) {
                    emailList.push(item);
                } else {
                    invalidList.push(item);
                }
            }
        });

        //if any invalid email
        if (!AppCommon._isEmpty(invalidList)) {
            var message = "Invalid email address";
            if (isChecked) {
                message = "Found invalid email id, however proceeded with correct ones.";
                message += " : " + invalidList;
            }
            $("#addFormError").removeClass("hide").html(message);
            if (!isChecked) {
                return;
            }
        }

        var data = {
            emailList: emailList
        };
        App.extensions._call("/promo/addEmail", data, function (error, result) {
            log.debug("addEmail error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            if (error) {
                App.extensions._showAlert(error);
                return;
            } else {
                var message = "";
                if (!AppCommon._isEmpty(result.error)) {
                    var errorArray = result.error;
                    message = "Error occurred for below email-ids " + errorArray;
                    self.showErrorMessage(message);
                }
                if (!AppCommon._isEmpty(result.success)) {
                    var successArray = result.success;
                    message = "Successfully added " + successArray;
                    self.showSuccessMessage(message);
                }
                $textArea.val(invalidList);
                $inputBox.val("");
            }
        });
    },

    isValidEmail: function (value) {
        var filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return filter.test(value);
    },

    showErrorMessage: function (message) {
        var $error = $("#promo-generic-error");
        $error.removeClass("hide");
        $error.find("span").html(message);
    },

    showSuccessMessage: function (message) {
        var $success = $("#promo-generic-success");
        $success.removeClass("hide");
        $success.find("span").html(message);
    },

    hideError: function () {
        $("#addFormError").addClass("hide");
        $("#promo-generic-success").addClass("hide");
        $("#promo-generic-error").addClass("hide");
    }
};
var log = new AppLogger("AddPromoAccount");
var promo = new PromoModel();


/*****************************************************************************/
/* : Lifecycle Hooks */
/*****************************************************************************/
Template.AddPromoAccount.created = function () {
};

Template.AddPromoAccount.rendered = function () {
    $('.ui.checkbox').checkbox();   //enable toggle
};

Template.AddPromoAccount.destroyed = function () {
};


