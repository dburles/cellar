Template.view.rendered = function() {
  return window.scrollTo();
};

Template.view.helpers({
  wine: function() {
    return Wines.findOne(Session.get('_id'));
  }
});