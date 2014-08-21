Template.search.rendered = function() {
  $('#search').focus();
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

Meteor.startup(function() {
  Deps.autorun(function() {
    if (Session.get('search')) {
      var searchResults;
      var route = Router.current() && Router.current().route.name;

      if (route === 'main')
        searchResults = Wines.search(Session.get('search')).count();
      if (route === 'archive')
        searchResults = Wines.search(Session.get('search'), { qty: 0 }).count();

      if (searchResults === 0)
        Session.set('alert', 'No results were found for that search query.');
      else
        Session.set('alert', false);
    }
  });
});