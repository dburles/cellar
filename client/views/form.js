Template.form.created = function() {
  Session.set('region', '');
  Session.set('winery', '');
  Session.set('type', '');
  return window.scrollTo(0, 0);
};

Deps.autorun(function() {
  Meteor.subscribe('wineries', Session.get('winery'));
  Meteor.subscribe('regions', Session.get('region'));
  Meteor.subscribe('varieties', Session.get('type'));
});

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
    return Varieties.search(Session.get('type'));
  },
  wineries: function() {
    return Wineries.search(Session.get('winery'));
  },
  regions: function() {
    return Regions.search(Session.get('region'));
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

    var data = {
      description: $('input[name="description"]').val(),
      drink_by: $('input[name="drink_by"]').val(),
      name: $('input[name="name"]').val(),
      notes: $('textarea[name="notes"]').val(),
      price: $('input[name="price"]').val(),
      purchased: $('input[name="purchased"]').val(),
      qty: $('select[name="qty"]').val(),
      rating: $('select[name="rating"]').val(),
      region: $('input[name="region"]').val(),
      type: $('input[name="type"]').val(),
      winery: $('input[name="winery"]').val(),
      year: $('input[name="year"]').val()
    };

    console.log(data);

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