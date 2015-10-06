Template.form.onCreated(function() {
  Session.set('region', '');
  Session.set('winery', '');
  Session.set('type', '');

  this.autorun(() => {
    this.subscribe('wineries', Session.get('winery'));
    this.subscribe('regions', Session.get('region'));
    this.subscribe('varieties', Session.get('type'));
  });
});

// window.scrollTo(0, 0);

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
    var self = this;
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

    if (self._id) {
      Meteor.call('update', this._id, data, function() {
        FlowRouter.go('view', { _id: self._id });
      });
    } else {
      Meteor.call('create', data, function(error, response) {
        FlowRouter.go('view', { _id: response });
      });
    }

    showAlert('"' + data.year + ' ' + data.winery + '" has been saved.');
  },
  'click .delete': function(event, template) {
    event.preventDefault();
    Session.set('deleteModal', true);
    $('.delete-modal').modal();
  },
  'click .cancel': function(event, template) {
    event.preventDefault();
    FlowRouter.go('view', { _id: this._id });
  }
});
