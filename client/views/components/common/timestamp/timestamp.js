/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Timestamp: Event Handlers and Helpers */
/*****************************************************************************/

Template.Timestamp.events({
});

Template.Timestamp.helpers({
    formatTime: function (timestamp) {
        var update = Session.get("timestampTrigger");
        var result = timeStampModel.getTime(timestamp);
        return result;
    }
});

function TimestampModel() {
}
TimestampModel.prototype = {
    constructor: TimestampModel,
    getTime: function (timestamp) {
        //log.debug("timestamp " + timestamp);
        //log.debug("isEmpty : " + AppCommon._isEmpty(timestamp));
        if (!AppCommon._isEmpty(timestamp)) {
            var result = {
                isYearlOld: false,
                isWeekly: false,
                isMonthly: false,
                isRecent: false,
                month: "",
                date: "",
                year: "",
                day: "",
                meridiem: "",
                time: ""
            };

            var timeInMili = parseInt(timestamp, 10);
            var postedDate = new Date(timeInMili);
            var currentDate = new Date();
            var momentWrapper = moment(timeInMili);

            //If not in this year
            if (postedDate.getFullYear() != currentDate.getFullYear()) {
                result.isYearlOld = true;
                result.month = momentWrapper.format("MMMM");
                result.date = momentWrapper.format("D");
                result.year = momentWrapper.format("YYYY");
            }

            var isInLastWeek = currentDate.getTime() - postedDate.getTime() <= milliSecondsInWeek;
            //log.debug("isInLastWeek : " + isInLastWeek);

            //If not in this month but not coming in a week margin also
            if (!isInLastWeek) {
                result.isMonthly = true;
                result.month = momentWrapper.format("MMMM");
                result.date = momentWrapper.format("D");
            } else {
                //if today
                var isToday = postedDate.getDate() == currentDate.getDate();
                //log.debug("isToday :" + isToday);

                if (isToday) {
                    result.isRecent = true;
                    result.time = "sec";

                    var milliSecPast = currentDate.getTime() - postedDate.getTime();

                    if (milliSecPast <= 60 * 1000) {
                        //one min means 60sec ==> 60*1000 milli
                        //under min
                        result.time = parseInt(milliSecPast / 1000, 10);
                        result.meridiem = "s";
                    }
                    else if (milliSecPast <= 60 * 60 * 1000) {
                        //eg : 5min == 5*60*1000
                        //1 min means 60 sec => 60*1000 milli
                        //x min
                        result.time = parseInt(milliSecPast / 60000, 10);
                        result.meridiem = "m";
                    } else if (milliSecPast <= 1000 * 60 * 60 * 60 * 24) {
                        //eg : 2hr = 2*60*60*1000
                        //1 hour means 60mins => 60*60 secs ==> 60*60*1000 milli
                        //x hr
                        result.time = parseInt(milliSecPast / 3600000, 10);
                        result.meridiem = "h"
                    }
                }
                else {
                    //log.debug("timestamp : " + timestamp + " " + new Date(timestamp));
                    result.isWeekly = true;
                    momentWrapper = momentWrapper.subtract('days', 7);
                    result.day = moment.weekdays(momentWrapper.day());
                }
            }

            //log.debug("result : " + AppCommon._toJSON(result));
            return result;
        }

        return result;
    }
};

var timeStampModel = new TimestampModel();
var log = new AppLogger("Timestamp");

/*****************************************************************************/
/* Timestamp: Lifecycle Hooks */
/*****************************************************************************/

Template.Timestamp.created = function () {
};

Template.Timestamp.rendered = function () {
    Session.setDefault("timestampTrigger",Date.now());
    Meteor.setInterval(function(){
        Session.set("timestampTrigger",Date.now());
    },1000);
};

Template.Timestamp.destroyed = function () {
};

/*
 * 1 sec = 1000 mili
 * 1 min = 60 sec
 * 1 hr = 60 min
 * 1 day = 24
 * 6 days = 6*24
 * */
var milliSecondsInWeek = 1000 * 60 * 60 * 24 * 6;
