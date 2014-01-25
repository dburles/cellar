Template.edit.helpers({
  wine: function() {
    return Wines.findOne(Session.get('_id'));
  }
});