accounting.settings.currency.format = "%v";

// always subscribe to the main list
Tracker.autorun(function() {
  if (Meteor.user()) {
    Meteor.subscribe('wines');
  }
});
