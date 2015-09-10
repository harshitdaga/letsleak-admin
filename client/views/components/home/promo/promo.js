/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* : Event Handlers and Helpersss Promo.js*/
/*****************************************************************************/
Template.Promo.events({
    'click #promoTemplate .menu a': function (event, selector) {
      var id = event.target.id;
        $("#promoTemplate .item").removeClass("active");
        $("#promoTemplate #"+id).addClass("active");
        switch (id) {
            case "add" :
                Session.set("template",promo.template.ADD);
                break;
            case "send" :
                Session.set("template",promo.template.SEND);
                break;
        }
    },
});

Template.Promo.helpers({
    template: function(){
        return Session.get("template");
    }
});


var PromoModel = function PromoModel() {
};

PromoModel.prototype = {
    constructor: PromoModel,
    template : {
        "ADD" : "AddPromoAccount",
        "SEND" : "SendPromoMail"
    }
};
var log = new AppLogger("Promo");
var promo = new PromoModel();


/*****************************************************************************/
/* : Lifecycle Hooks */
/*****************************************************************************/
Template.Promo.created = function () {
};

Template.Promo.rendered = function () {
    Session.setDefault("template",promo.template.SEND);
};

Template.Promo.destroyed = function () {
    delete Session.keys["template"];
};


