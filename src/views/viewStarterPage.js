var ViewStarterPage = Backbone.View.extend({
    events: {
        "click .start1": "startOne",
        "click .back": "backOne",
        "click .addadmin": "addAdmin",
        "click .delete": "deleteAdmin",
        "click .btn-delete": "deleteAdminBtn"

    },
    initialize: function() {
        //this.render();
        var self = this;
        console.log("ready and listenig");
        //this.render();
        this.getAdmins();

    },
    watchModel: function() {
        console.log(this.model);
        this.listenTo(this.model, 'change', this.render);
    },
    render: function() {

        console.log("rendering!!!!");
        //this.getAdmins();
        this.$el.html(Handlebars.templates.starter(this.model.toJSON()));
        this.delegateEvents();
        $.when(fade).done(function() {
            $("#content").fadeIn();
        });
        return this;
    },
    startOne: function() {
        document.location.href = "#/starter/one";
        $(".card:nth(1)").fadeIn(function() {
            $('.card:nth(1)').animate({
                'marginLeft': 0
            }, 500);
            $('.progress.is-info').val(25);
        });
    },
    backOne: function() {

        $('.card:nth(1)').animate({
            'marginLeft': 2000
        }, 500);
        $('.progress.is-info').val(10);
    },
    getAdmins: function() {
        var self = this;
        var temp = self.$el;

        this.model.fetch({
            success: function(data) {
                console.log(self.model);
                self.render();
            }
        });

        /**

        $.get( "http://localhost:3000/admins", function( data ) {
          //alert( "Data Loaded: " + data );
          var obj = JSON.parse(data);
          console.log(obj);
          self.model.set("data", obj.response);
          console.log(self.model.get("data"));
          self.render();
        });
        **/


    },
    addAdmin: function() {
        console.log("adding Admin");
        var self = this;
        var fname = document.querySelector('.addfname').value;
        var lname = document.querySelector('.addlname').value;

        if (!fname || !lname) {
            alert("Please enter a first name and last name")
        } else {

            this.model.save({
                fname: fname,
                lname: lname
            }, {
                url: "http://localhost:49999/admins/add",
                success: function(data) {
                    self.getAdmins();
                }
            });
        }

    },
    deleteAdmin: function() {
        console.log("removing admin");
        var self = this;
        var fname = document.querySelector('.fname').value;
        var lname = document.querySelector('.lname').value;
        console.log(fname);
        if (!fname || !lname) {
            alert("Please enter a first name and last name")
        } else {
            $.ajax({
                url: 'http://localhost:49999/admins/delete',
                data: {
                    fname: fname,
                    lname: lname
                },
                method: 'post',
                success: function(data) {
                    console.log(data);
                    var request = JSON.parse(data);
                    console.log(request);
                    if (request.resutls.affectedRows <= 0) {
                        alert("There was no entry to delete.");
                    } else {
                        self.getAdmins();
                    }

                }

            })

        }


    },
    deleteAdminBtn: function(event) {
        var text = $(event.target).parent().siblings(":first").text();
        console.log(parseInt(text));
        var self = this;
        



            $.ajax({
                url: 'http://localhost:49999/admins/delete/id',
                data: {
                    id: parseInt(text)

                },
                method: 'post',
                success: function(data) {
                    console.log(data);
                    var request = JSON.parse(data);
                    console.log(request);
                    if (request.resutls.affectedRows <= 0) {
                        alert("There was no entry to delete.");
                    } else {
                        self.getAdmins();
                    }

                }

            })




    }



});
