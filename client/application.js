accounting.settings.currency.format = "%v";
NProgress.settings.showSpinner = false;

window.addEventListener('load', function() {
  FastClick.attach(document.body);
}, false);

View.after(function() {
  Session.set('search', '');
  Session.set('toggleSearch', false);
});

View.setDefault('home');

Template.application.helpers({
  pageView: function() {
    return View.current() && Template[View.current()];
  }
});

Template.application.events({
  'click a, click button': function(event, template) {
    event.preventDefault();
    var href = event.currentTarget.attributes.href || event.currentTarget.attributes['data-href'];

    if (href && Template[href.value])
      View.set(href.value);
  }
});

var subs = {};

Meteor.startup(function() {
  Deps.autorun(function() {
    var currentView = View.current();

    // XXX should be less dumb
    if (! Meteor.user() && ! Meteor.loggingIn() && currentView !== 'auth')
      View.set('signIn');

    if (Meteor.user() && (currentView === 'signIn' || currentView === 'auth'))
      View.set('home');

    if (! Meteor.user())
      return;

    if (_.contains(['home', 'edit', 'view'], currentView)) {
      subs.wines = Meteor.subscribe('wines');
      NProgress.start();
      if (subs.wines.ready())
        NProgress.done();
    }

    if (currentView === 'archive') {
      subs.archive = Meteor.subscribe('archive');
      NProgress.start();
      if (subs.archive.ready())
        NProgress.done();
    }

    if (currentView === 'edit' || currentView === 'view')
      subs.wine = Meteor.subscribe('wine', Session.get('_id'));
  });
});
