Template.list.rendered = function() {
  return window.scrollTo();
};

Template.list.helpers({
  showSearch: function() {
    return Session.get('toggleSearch');
  }
});