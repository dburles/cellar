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
  },
  modal: function() {
    return Session.get('promptModal');
  }
});

Template.application.events({
  'click a': function(event, template) {
    event.preventDefault();
    var href = event.currentTarget.attributes.href;
    if (href && Template[href.value])
      View.set(href.value);
  }
});

Meteor.startup(function() {
  Deps.autorun(function() {
    var currentView = View.current();
    
    if (! Meteor.user() && ! Meteor.loggingIn())
      View.set('signIn');
    else if (Meteor.user() && currentView === 'signIn')
      View.set('home');

    if (currentView === 'archive')
      Meteor.subscribe('archive');
    if (currentView === 'edit')
      Meteor.subscribe('wine', Session.get('_id'));
  });
});
