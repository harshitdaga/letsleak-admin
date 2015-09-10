/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/**
 * Created by harshit on 19/08/14.
 */
App = {};


App.helpers = {
    toLowerCase: function (value) {
        if (!AppCommon._isEmpty(value) && value.length > 0) {
            return new Spacebars.SafeString(value.toLowerCase());
        }
        return value;
    },

    toUpperCase: function (value) {
        if (!AppCommon._isEmpty(value) && value.length > 0) {
            return new Spacebars.SafeString(value.toUpperCase());
        }
        return value;
    },

    toCapitalize: function (value) {
        if (!AppCommon._isEmpty(value) && value.length > 0) {
            return new Spacebars.SafeString(value[0].toUpperCase() + value.slice(1));
        }
        return value;
    },

    isLoggedIn: function () {
        return App.extensions._isLoggedIn();
    },

    eq: function (value1, value2, ignoreCase) {
        if (_.isBoolean(ignoreCase)) {
            if (!AppCommon._isEmpty(value1) && !AppCommon._isEmpty(value2)) {
                return _.isEqual(value1.toLowerCase(), value2.toLowerCase());
            }
        }
        return _.isEqual(value1, value2);
    },

    neq: function (value1, value2, ignoreCase) {
        if (_.isBoolean(ignoreCase)) {
            if (!AppCommon._isEmpty(value1) && !AppCommon._isEmpty(value2)) {
                return !_.isEqual(value1.toLowerCase(), value2.toLowerCase());
            }
        }
        return !_.isEqual(value1, value2);
    },

    setFontClass: function (bgColor) {
        if(!AppCommon._isEmpty(bgColor)){
            return App.extensions._getFontColor(bgColor);
        }
    },
    enableTableSort : function(tableId){
        console.log("tableId:" + tableId);
        $('#'+tableId).tablesort();
    },

    convertToString : function(value) {
        console.log(value);
        return value.toString();
    },

    _validAgent : function(){
        var userId = App.extensions._getUserId();
        return _.isEqual("harshit", userId);
    }
};

_.each(App.helpers, function (helper, key) {
    UI.registerHelper(key, helper);
});


App.extensions = {

    _call: function (name, param, callback) {
        if (_.isUndefined(callback)) {
            return Meteor.call(name, this._wrapWithXtraParam(param));
        }
        else {
            //Since async call no return required.
            Meteor.call(name, this._wrapWithXtraParam(param), callback);
        }
    },

    _subscribe: function (self, name, param) {
        return self.subscribe(name, this._wrapWithXtraParam(param));
    },

    _wrapWithXtraParam: function (requestData) {
        return {
            data: AppCommon._isEmpty(requestData) ? undefined : requestData,
            agent: {
                "userId": this._getUserId(),
                "session": this._getSession()
            },
        };
    },
    _showAlert : function(message){
        alert(message);
    },

    _addTitle: function (title) {
        title = title || "Admin";
        $("title").html(title);
    },

    _addActiveHeader : function(id){
        $("#headerTemplate").find(".active").removeClass("active");
        $("#headerTemplate #"+id).addClass("active");
    },

    _setSession: function (loginRequest) {
        amplify.store("admin_user_id", loginRequest.userId);
        amplify.store("adminSession", loginRequest.session);
    },

    _getSession: function () {
        return amplify.store("adminSession");
    },

    _clearSession: function () {
        amplify.store("admin_user_id", null);
        amplify.store("adminSession", null);
        Router.go("index");
    },

    _isLoggedIn: function () {
        return !_.isUndefined(this._getSession());
    },

    _logout: function () {
        this._clearSession();
        Router.go("index");
    },

    _getUserId: function (style) {
        if (AppCommon._isEmpty(style))
            return amplify.store("admin_user_id");

        if (_.isEqual(style.toLowerCase(), "lower"))
            return amplify.store("admin_user_id").toLowerCase();
    },

    _deleteSessionKeys: function (sessionKeysArray) {
        var key;
        var item = "";
        for (item in sessionKeysArray) {
            key = sessionKeysArray[item];
            delete Session.keys[key];
            delete Session.keyDeps[key];
            delete Session.keyValueDeps[key];
        }
    }
};