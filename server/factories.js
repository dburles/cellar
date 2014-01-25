Factories.user = new Factory(Meteor.users, {
  emails: [{
    address: 'test@example.com',
    verified: false
  }],
  services: {
    password: {
      srp: SRP.generateVerifier('test')
    }
  }
});