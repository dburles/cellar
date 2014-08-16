Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
});

Router.goBack = function() {
  history.back();
};

Router.onBeforeAction(function(pause) {
  if (! Meteor.user() && ! Meteor.loggingIn()) {
    this.render('signIn');
    return pause();
  }

  this.wait(Meteor.subscribe('wines'));

  NProgress.start();
  
  if (this.ready())
    NProgress.done();
}, { except: ['auth'] });

Router.map(function() {
  this.route('main', { path: '/' });
  this.route('view', { path: '/view/:_id' });
  this.route('archive', { path: '/archive' });
  this.route('add', { path: '/add' });
  this.route('edit', { path: '/edit/:_id' });
  this.route('auth', { path: '/auth' });
});

MainController = RouteController.extend({
  template: 'list',
  canSearch: true,
  data: function() {
    var wines;

    if (Session.get('search'))
      wines = Wines.search(Session.get('search'));
    else
      wines = Wines.find({ qty: { $gt: 0 }}, { sort: { ref: -1 }});

    return {
      wines: wines
    };
  }
});

ViewController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('wine', this.params._id);
  },
  data: function() {
    return Wines.findOne(this.params._id);
  }
});

ArchiveController = RouteController.extend({
  canSearch: true,
  onBeforeAction: function() {
    this.wait(Meteor.subscribe('archive'));

    NProgress.start();
    
    if (this.ready())
      NProgress.done();
  },
  data: function() {
    var wines;

    if (Session.get('search'))
      wines = Wines.search(Session.get('search'), { qty: 0 });
    else
      wines = Wines.find({ qty: 0 }, { sort: { ref: -1 }});

    return {
      wines: wines
    };
  }
});

EditController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('wine', this.params._id);
  },
  data: function() {
    return Wines.findOne(this.params._id);
  }
});

AuthController = RouteController.extend({
  onBeforeAction: function() {
    if (Meteor.user())
      Router.go('main');
  }
});