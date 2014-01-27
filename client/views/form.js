Template.form.rendered = function() {
  return window.scrollTo();
};

Template.form.helpers({
  selectOptionsQty: function() {
    return {
      name: 'qty',
      value: this.qty,
      options: _.map(_.range(25), function(qty) {
        return {
          name: qty,
          value: qty
        };
      })
    };
  },
  selectOptionsRating: function() {
    return {
      name: 'rating',
      value: this.rating,
      options: [
        {
          name: 'None',
          value: 'None'
        }
      ].concat(_.map(_.range(1, 11).reverse(), function(rating) {
        return {
          name: rating,
          value: rating
        };
      }))
    };
  },
  varieties: function() {
    return Varieties.find({ }, { sort: name });
  },
  wineries: function() {
    return Wineries.find({}, { sort: name });
  },
  regions: function() {
    return Regions.find({}, { sort: name });
  }
});

Template.form.events({
  'keyup .autocomplete': function(event, template) {
    var value = event.target.value.length > 1 ? event.target.value : '';
    Session.set(event.target.name, value);
  },
  'click .ac': function(event, template) {
    event.preventDefault();
    var name = event.target.attributes['data-name'].value;
    Session.set(name, '');
    $('input[name="' + name + '"]').val(event.target.text);
  },
  'submit #form': function(event, template) {
    event.preventDefault();
    var data = $('#form').toObject();

    if (! data.year)
      return showError("Year is required");

    if (this._id) {
      Meteor.call('update', this._id, data);
    } else {
      Meteor.call('create', data);
    }
    
    View.set(View.previous());

    _.defer(function() {
      showAlert('"' + data.year + ' ' + data.winery + '" has been saved.');
    });
  },
  'click .delete': function(event, template) {
    event.preventDefault();
    Session.set('deleteModal', true);
    $('.delete-modal').modal();
  },
  'click .cancel': function(event, template) {
    event.preventDefault();
    View.set(View.previous());
  }
});