Template.view.created = function() {
  return window.scrollTo(0, 0);
};

Template.view.events({
  'click .back': function() {
    Router.goBack();
  }
});