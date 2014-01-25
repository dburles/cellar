Template.deleteModal.events({
  'click .delete': function(event) {
    event.preventDefault();
    var wine = Wines.findOne(Session.get('_id'));
    Wines.remove(Session.get('_id'));
    Session.set('deleteModal', false);
    $('.delete-modal').modal('hide');
    View.set(View.previous());
    _.defer(function() {
      showError('"' + wine.year + ' ' + wine.winery + '" has been deleted.');
    });
  },
  'click .cancel': function(event) {
    event.preventDefault();
    Session.set('deleteModal', false);
    $('.delete-modal').modal('hide');
  }
});