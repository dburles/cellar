ViewController = function() {
  this.afterHooks = [];
};

ViewController.prototype.setDefault = function(template) {
  Session.setDefault('view', template);
};

ViewController.prototype.set = function(template) {
  Session.set('previousView', Session.get('view'));
  Session.set('view', template);
  _.each(this.afterHooks, function(cb) {
    cb();
  });
};

ViewController.prototype.current = function() {
  return Session.get('view');
};

ViewController.prototype.previous = function() {
  return Session.get('previousView');
};

ViewController.prototype.after = function(fn) {
  this.afterHooks.push(fn);
  return this;
};

View = new ViewController();