Template.list.created = function() {
  return window.scrollTo(0, 0);
};

Template.list.helpers({
  showSearch: function() {
    return Session.get('toggleSearch');
  }
});