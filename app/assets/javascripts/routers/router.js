SofaHopping.Routers.Router = Backbone.Router.extend({

  routes: {
    "": "userDashboard",
    "users/new": "new",
    "session/new": "signIn",
    "people/:id": "userProfile",
    "members/search": "memberSearchBar",
    "members/hosts": "findHosts",
    "members/all": "findAllMembers",
    "members/travelers": "findAllTravelers"
  },

  initialize: function(options){
    this.$rootEl = options.$rootEl;
  },

  new: function(){

    if (!this._requireSignedOut()) {
      return; }

    var newUser = new SofaHopping.Models.User({});
    var formView = new SofaHopping.Views.UsersForm({
      model: newUser
    });

    this._swapView(formView);
  },

  signIn: function(callback){

    if (!this._requireSignedOut(callback)) { return; }

    var signInView = new SofaHopping.Views.SignIn({
      callback: callback
    });
    this._swapView(signInView);
  },

  memberSearchBar: function(redirected){

    var hosting_status = $(event.currentTarget).find("#hosting_status").val();

    if (hosting_status === "1"){
      Backbone.history.navigate("members/hosts", { trigger: true });
    }
    else if (hosting_status === "2"){
      Backbone.history.navigate("members/all", { trigger: true });
    }
    else if (hosting_status === "3"){
      Backbone.history.navigate("members/travelers", { trigger: true });
    }
  },

  userDashboard: function(){

    var callback = this.userDashboard.bind(this);

    if (!this._requireSignedIn(callback)) { return; }

    var user = SofaHopping.users.getOrFetch(SofaHopping.currentUser.id);
    var dashboardView = new SofaHopping.Views.DashboardView({ model: user });

    this._swapView(dashboardView);
  },

  userProfile: function(id){
    var callback = this.userProfile.bind(this, id);
    if (!this._requireSignedIn(callback)) { return; }

    var visitedUser = SofaHopping.users.getOrFetch(id);

    var userProfileView = new SofaHopping.Views.ProfileView({
      model: visitedUser });

    this._swapView(userProfileView);
  },

  findHosts: function(){
    var callback = this.findHosts.bind(this);
    if (!this._requireSignedIn(callback)) { return; }

    var hosts = new SofaHopping.Collections.Users();
    hosts.fetch({ data: { status: "Accepting Guests" }});

    var membersView = new SofaHopping.Views.MembersView({
      collection: hosts, searchType: "hosts" })
    this._swapView(membersView);

  },

  findAllMembers: function(){
    var callback = this.findAllMembers.bind(this);
    if (!this._requireSignedIn(callback)) { return; }

    var allMembers = new SofaHopping.Collections.Users();
    allMembers.fetch();

    var membersView = new SofaHopping.Views.MembersView({
      collection: allMembers, searchType: "all" })
    this._swapView(membersView);
  },

  findAllTravelers: function(){
    var callback = this.findAllTravelers.bind(this);
    if (!this._requireSignedIn(callback)) { return; }

    var allTravelers = new SofaHopping.Collections.Users();
    allTravelers.fetch({ data: { trips : true }});

    var travelersView = new SofaHopping.Views.MembersView({
      collection: allTravelers, searchType: "travelers" })
    this._swapView(travelersView);
  },



  _requireSignedIn: function(callback){

    if (!SofaHopping.currentUser.isSignedIn()) {
      callback = callback || this._goHome;
      this.signIn(callback);
      return false;
    }

    return true;
  },

  _requireSignedOut: function(callback){
    if (SofaHopping.currentUser.isSignedIn()) {
      callback = callback || this._goHome;
      callback();
      return false;
    }

    return true;
  },

  _goHome: function(){
      Backbone.history.navigate("", { trigger: true });
    },

  _swapView: function(view){
    this.currentView && this.currentView.remove();

    this.$rootEl.html(view.render().$el);
    this.$rootEl.prepend("<section class=\"server_responses\"></section>");
    this.currentView = view;
  }
})
