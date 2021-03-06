Template.view.onCreated = function() {
  this.autorun(() => {
    this.subscribe('wine', FlowRouter.getParam('_id'));
  });
};

Template.view.events({
  'click .back': function() {
    FlowRouter.goBack();
  }
});

Template.view.helpers({
  wine() {
    return Wines.findOne(FlowRouter.getParam('_id'));
  }
});
