/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var Local = new Meteor.Collection(null);

Local.removeLocalType = function(f_local_type){
    this.remove({f_local_type:f_local_type});
};

_.extend(AppCollection, {
    Local: Local
});