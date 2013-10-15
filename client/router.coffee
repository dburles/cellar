Router.configure
	layout: 'layout'

Router.map ->
	@.route 'home',
		path: '/'
	@.route 'archive',
		path: '/archive'
		controller: 'ArchiveController'
	@.route 'add',
		path: '/add'
		controller: 'AddController'
	@.route 'edit',
		path: '/edit/:_id'
		controller: 'EditController'
	return

requireLogin = ->
	if not Meteor.user()
		Router.go 'home'

@AddController = RouteController.extend
	before: requireLogin

@ArchiveController = RouteController.extend
	before: requireLogin
	onAfterRun: ->
		Meteor.subscribe 'archive', Meteor.userId()

@EditController = RouteController.extend
	data: ->
		Wines.findOne @.params._id

