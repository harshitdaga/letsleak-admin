/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
AppLogger = function AppLogger(funcName) {
    this.funcName = funcName || "";
};

AppLogger.prototype = {
    constructor: AppLogger,
    debug: function (message) {
        if (this.isDebugEnabled()) {
            console.debug("[" + this.funcName + "] " + message);
        }
    },
    info: function (message) {
        if (this.isInfoEnabled()) {
            console.info("[" + this.funcName + "] " + message);
        }
    },

    error: function (message) {
        if (this.isErrorEnabled()) {
            console.error("[" + this.funcName + "] " + message);
        }
    },

    isDebugEnabled: function () {
        return this.activeStatus() === this.levels.DEBUG;
    },

    isInfoEnabled: function () {
        return (this.activeStatus() === this.levels.DEBUG || this.activeStatus() === this.levels.INFO);
    },

    isErrorEnabled: function () {
        return !(this.activeStatus() == this.levels.NONE);
    },

    activeStatus: function () {
        var level = this.levels.ERROR;
        var href = location.href;
        if (href.indexOf("http://localhost") != -1) {
            level = this.levels.DEBUG;
        }
        return level;
    },

    levels: {
        INFO: "INFO",
        DEBUG: "DEBUG",
        ERROR: "ERROR",
        NONE: "NONE"
    }
};
