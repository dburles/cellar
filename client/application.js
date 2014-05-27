accounting.settings.currency.format = "%v";
NProgress.settings.showSpinner = false;

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

Meteor.startup(function() {
  Deps.autorun(function() {
    var currentView = View.current();

    if (Meteor.user())
      Meteor.subscribe('wines');

    // XXX should be less dumb
    if (! Meteor.user() && ! Meteor.loggingIn() && View.current() !== 'auth')
      View.set('signIn');

    if (Meteor.user() && (currentView === 'signIn' || currentView === 'auth'))
      View.set('home');

    if (currentView === 'archive')
      Meteor.subscribe('archive');
    if (currentView === 'edit' || currentView === 'view')
      Meteor.subscribe('wine', Session.get('_id'));
  });
});
