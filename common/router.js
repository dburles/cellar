var requireLogin = function() {
  if (!Meteor.user()) {
    return Router.go('signIn');
  }
};

Router.configure({
  layoutTemplate: 'layout'
});

Router.before(requireLogin, { except: [
  'signIn'
]});

Router.map(function() {
  this.route('signIn', {
    before: function() {
      if (Meteor.user())
        Router.go('home');
    },
    path: '/signIn'
  });
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
      return this.subscribe('archive');
    },
    after: function() {
      return Session.set('loaded', true);
    }
  });
  this.route('add', {
    path: '/add'
  });
  this.route('edit', {
    path: '/edit/:_id',
    before: function() {
      return this.subscribe('wine', this.params._id);
    },
    data: function() {
      return Wines.findOne(this.params._id);
    }
  });
});
