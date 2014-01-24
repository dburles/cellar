var requireLogin = function() {
  if (!Meteor.user()) {
    return Router.go('home');
  }
};

Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/'
    // waitOn: function() {
    //   return Meteor.subscribe('wines');
    // },
    // after: function() {
    //   return Session.set('loaded', true);
    // }
  });
  this.route('archive', {
    path: '/archive',
    before: function() {
      requireLogin();
      return this.subscribe('archive');
    },
    after: function() {
      return Session.set('loaded', true);
    }
  });
  this.route('add', {
    before: requireLogin,
    path: '/add'
  });
  this.route('edit', {
    path: '/edit/:_id',
    before: function() {
      requireLogin();
      return this.subscribe('wine', this.params._id);
    },
    data: function() {
      return Wines.findOne(this.params._id);
    }
  });
});
