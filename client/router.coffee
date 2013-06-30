Meteor.Router.add {
	'/':
		as: 'home'
		to: ->
			Session.set('archive', false)
			'home'
	'/archive':
		as: 'archive'
		to: ->
			Session.set('archive', true)
			'archive'
	'*': 'not_found'
}