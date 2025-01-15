var AppRouter = Backbone.Router.extend({
    routes: {
        "": "showStartPage",
        "/": "showStartPage",
        "#": "showStartPage"
    },
    showStartPage: function(item) {
        console.log(item);

        fade = new $.Deferred();
        $("#content").fadeOut(function() {
            fade.resolve();
            $("#content").html(starterViewPage.render().el);
        });

    }

});


/* Global Variables */

var router = null; //Router

var fade = null; // Fade in Option

var starterModelPage = null; //Holder for Model for Data
var starterViewPage = null; // View for Page


starterModelPage = new ModelStarterPage();

starterViewPage = new ViewStarterPage({
    model: starterModelPage
})


router = new AppRouter();

Backbone.emulateHTTP = true;
Backbone.history.start();
//})
