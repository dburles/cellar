ViewController = function() {
  this.beforeHooks = [];
  this.afterHooks = [];
};

ViewController.prototype.setDefault = function(template) {
  Session.setDefault('view', template);
};

ViewController.prototype.set = function(template) {
  console.log('view set: ' + template);
  _.each(this.beforeHooks, function(cb) {
    if (cb.ex.indexOf(template) === -1)
      cb.fn();
  });
  Session.set('previousView', Session.get('view'));
  Session.set('view', template);
  _.each(this.afterHooks, function(cb) {
    if (cb.ex.indexOf(template) === -1)
      cb.fn();
  });
};

ViewController.prototype.current = function() {
  return Session.get('view');
};

ViewController.prototype.previous = function() {
  return Session.get('previousView');
};

ViewController.prototype.before = function(fn, exclusions) {
  if (! exclusions) exclusions = [];
  this.beforeHooks.push({ fn: fn, ex: exclusions });
  return this;
};

ViewController.prototype.after = function(fn, exclusions) {
  if (! exclusions) exclusions = [];
  this.afterHooks.push({ fn: fn, ex: exclusions });
  return this;
};

View = new ViewController();