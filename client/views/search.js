Template.search.rendered = function() {
  // $('#search').focus();
};

Template.search.helpers({
  search: function() {
    return Session.get('search');
  },
  hasSearch: function() {
    return !!Session.get('search');
  }
});

Template.search.events({
  'keyup #search': function(event) {
    event.preventDefault();
    _.defer(function() {
      Session.set('search', $('#search').val());
    });
  },
  'click .clear': function() {
    Session.set('search', '');
  }
});
