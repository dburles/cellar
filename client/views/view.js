Template.view.created = function() {
  return window.scrollTo(0, 0);
};

Template.view.helpers({
  wine: function() {
    return Wines.findOne(Session.get('_id'));
  }
});