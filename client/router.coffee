requireLogin = ->
	if not Meteor.user()
		Router.go 'home'

Router.configure
	layoutTemplate: 'layout'

Router.map ->
	@.route 'home',
		path: '/'
		waitOn: ->
			Meteor.subscribe 'wines', Meteor.userId()
		after: ->
			Session.set 'loaded', true
	@.route 'archive',
		before: requireLogin
		path: '/archive'
		waitOn: ->
			Meteor.subscribe 'archive', Meteor.userId()
		after: ->
			Session.set 'loaded', true
	@.route 'add',
		before: requireLogin
		path: '/add'
	@.route 'edit',
		before: requireLogin
		path: '/edit/:_id'
		waitOn: ->
			Meteor.subscribe 'wine', @params._id
		data: ->
			Wines.findOne @.params._id
	return
