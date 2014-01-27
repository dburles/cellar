Template.item.events({
  'click a': function(event, template) {
    event.preventDefault();
    Session.set('_id', this._id);
    View.set('view');
  }
});