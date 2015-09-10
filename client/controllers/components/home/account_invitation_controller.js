/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
AccountInvitationController = BaseController.extend({
    waitOn: function () {
        Session.setDefault("accountInvitationReady", false);
        Session.setDefault("pendingInvitationCount", 1);
        App.extensions._call("/invitation/account/getPendingAccount", {limit: 1}, function (error, result) {
            var handler = new AccountInvitationModel();
            handler.getPendingAccountHandler(error, result);
            Session.set("accountInvitationReady", true);
        });
    },

    data: function () {
    },

    action: function () {
        if (Session.get("accountInvitationReady")) {
            this.render();
        }
    }
});
var log = new AppLogger("AccountInvitationController");