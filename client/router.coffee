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
		path: '/archive'
		waitOn: ->
			Meteor.subscribe 'archive', Meteor.userId()
		after: ->
			Session.set 'loaded', true
		controller: 'ArchiveController'
	@.route 'add',
		path: '/add'
		controller: 'AddController'
	@.route 'edit',
		path: '/edit/:_id'
		waitOn: ->
			Meteor.subscribe 'wine', @params._id
		controller: 'EditController'
	return

requireLogin = ->
	if not Meteor.user()
		Router.go 'home'

@AddController = RouteController.extend
	before: requireLogin

@ArchiveController = RouteController.extend
	before: requireLogin


@EditController = RouteController.extend
	data: ->
		Wines.findOne @.params._id

