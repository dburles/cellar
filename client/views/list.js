Template.list.rendered = function() {
  $('.list-group').isotope({
    itemSelector: '.col-sm-4',
    layoutMode: 'fitRows'
  });
  return window.scrollTo();
};

Template.list.helpers({
  showSearch: function() {
    return Session.get('toggleSearch');
  }
});