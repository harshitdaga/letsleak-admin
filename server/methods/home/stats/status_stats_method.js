/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Invitation Methods */
/*****************************************************************************/
var log = AppLogger.getLogger(AppLogger.loggerName.STATS);

Meteor.methods({
    '/stats/message/getStatusDetails': function (request) {
        log.debug("/message/getStatusDetails", {request: request});
        var id = request.data._id;
        return AppCollection.Status.findOne(
            {"_id": id  }
        );
    }
});