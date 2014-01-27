Template.select.helpers({
  decoratedOptions: function() {
    var self = this;
    return _.map(self.options, function(option) {
      option.selected = option.value === parseInt(self.value);
      return option;
    });
  },
  isSelected: function() {
    return this.selected ? { selected: true } : {};
  }
});