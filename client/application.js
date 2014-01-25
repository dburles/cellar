Deps.autorun(function() {
  Meteor.subscribe('wineries', Session.get('winery'));
  Meteor.subscribe('regions', Session.get('region'));
  Meteor.subscribe('varieties', Session.get('variety'));
});

accounting.settings.currency.format = "%v";


Meteor.subscribe('wines');


View.after(function() {
  Session.set('search', '');
  Session.set('toggleSearch', false);
});

View.setDefault('home');

Template.application.helpers({
  view: function() {
    return View.current() && Template[View.current()];
  }
});

Template.application.events({
  'click a, click button': function(event, template) {
    event.preventDefault();
    var href = event.currentTarget.attributes.href || event.currentTarget.attributes['data-href'];
    console.log(href);
    if (href && Template[href.value])
      View.set(href.value);
  }
});

Meteor.startup(function() {
  Deps.autorun(function() {
    var currentView = View.current();

    // XXX should be less dumb
    if (! Meteor.user() && ! Meteor.loggingIn() && View.current() !== 'auth')
      View.set('signIn');
    
    if (Meteor.user() && currentView === 'signIn')
      View.set('home');

    if (currentView === 'archive')
      Meteor.subscribe('archive');
    if (currentView === 'edit')
      Meteor.subscribe('wine', Session.get('_id'));
  });
});
