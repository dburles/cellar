Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
});

Router.goBack = function() {
  history.back();
};

Router.onBeforeAction(function() {
  if (! Meteor.user() && ! Meteor.loggingIn())
    return this.render('auth');

  this.subscribe('wines');
  this.next();

}, { except: ['auth'] });

Router.onBeforeAction(function() {
  if (! this.ready())
    NProgress.start();
  
  if (this.ready())
    NProgress.done();

  this.next();
}, { except: ['auth']});

Router.map(function() {
  this.route('main', { path: '/' });
  this.route('drinknow', { path: '/drinknow' });
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
  subscriptions: function() {
    return Meteor.subscribe('wine', this.params._id);
  },
  data: function() {
    return Wines.findOne(this.params._id);
  }
});

ArchiveController = RouteController.extend({
  canSearch: true,
  subscriptions: function() {
    return Meteor.subscribe('archive');
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

DrinknowController = RouteController.extend({
  canSearch: true,
  subscriptions: function() {
    return Meteor.subscribe('drinknow');
  },
  data: function() {
    var wines;

    if (Session.get('search'))
      wines = Wines.search(Session.get('search'), { qty: { $gt: 0 }, drink_by: { $lte: new Date().getFullYear() }});
    else
      wines = Wines.find({ qty: { $gt: 0 }, drink_by: { $lte: new Date().getFullYear() }}, { sort: { ref: -1 }});

    return {

      wines: wines
    };
  }
});

EditController = RouteController.extend({
  subscriptions: function() {
    return Meteor.subscribe('wine', this.params._id);
  },
  data: function() {
    return Wines.findOne(this.params._id);
  }
});

AuthController = RouteController.extend({
  onBeforeAction: function() {
    if (Meteor.user())
      return Router.go('main');

    this.next();
  }
});