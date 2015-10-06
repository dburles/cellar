Template.edit.onCreated(function() {
  this.autorun(() => {
    this.subscribe('wine', FlowRouter.getParam('_id'));
  });
});

Template.edit.helpers({
  wine() {
    return Wines.findOne(FlowRouter.getParam('_id'));
  }
});
