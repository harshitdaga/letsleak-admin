/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*
 * Add query methods like this:
 *  AccountInvitation.findPublic = function () {
 *    return AccountInvitation.find({is_public: true});
 *  }
 */
var AccountInvitation = new Meteor.Collection('c_account_invitation');
_.extend(AppCollection, {
    AccountInvitation: AccountInvitation
});