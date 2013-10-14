Router.configure
  layout: 'layout'

Router.map ->
  @.route 'home',
  	path: '/'
  	controller: 'HomeController'
  @.route 'archive',
  	path: '/archive'
  	controller: 'ArchiveController'
  @.route 'edit',
  	path: '/edit/:_id'
  	controller: 'EditController'
  @.route 'add',
  	path: '/add'
  	controller: 'EditController'
  return

@HomeController = RouteController.extend
	onAfterRun: ->
		return

@ArchiveController = RouteController.extend
	onAfterRun: ->
		Meteor.subscribe 'archive', Meteor.userId()

@EditController = RouteController.extend
	onAfterRun: ->
		Session.set 'editing', @.params._id
	data: ->
		Wines.findOne @.params._id
