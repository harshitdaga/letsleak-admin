/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
AccountStatsController = BaseController.extend({
    waitOn: function () {
        Session.setDefault(accountStatsReady, false);
        App.extensions._call("/stats/account/getInvitedAccounts", {limit: 1}, function (error, result) {
            var handler = new AccountStatsModel();
            handler.getInvitedAccountHandler(error, result);
            Session.set(accountStatsReady, true);
        });
    },

    data: function () {
    },

    action: function () {
        if (Session.get(accountStatsReady)) {
            this.render();
            App.extensions._deleteSessionKeys([accountStatsReady]);
        }
    }
});
var log = new AppLogger("AccountStatsController");
var accountStatsReady = accountStatsReady;