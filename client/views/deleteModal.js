Template.deleteModal.events({
  'click .delete': function(event) {
    event.preventDefault();
    var wine = this;
    Meteor.call('remove', wine._id);

    Session.set('deleteModal', false);
    $('.delete-modal').modal('hide');
    
    showError('"' + wine.year + ' ' + wine.winery + '" has been deleted.');

    if (wine.qty === 0)
      Router.go('archive');
    else
      Router.go('main');
  },
  'click .cancel': function(event) {
    event.preventDefault();
    Session.set('deleteModal', false);
    $('.delete-modal').modal('hide');
  }
});