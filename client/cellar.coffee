Session.setDefault('form_visibility', 'invisible')
Session.setDefault('editing', false)
Session.setDefault('sort_field', 'ref')
Session.setDefault('sort_by', -1)
Session.setDefault('archive', false)

Meteor.startup ->
	$('body').spin('modal')
	Session.set('loaded', false)

globalSubscriptionHandles = []

globalSubscriptionHandles.push Meteor.subscribe 'wineries'
globalSubscriptionHandles.push Meteor.subscribe 'regions'
globalSubscriptionHandles.push Meteor.subscribe 'varieties'

Deps.autorun ->
	if Meteor.user()
		globalSubscriptionHandles.push Meteor.subscribe('wines', Meteor.userId(), Session.get 'archive')
	
	isReady = globalSubscriptionHandles.every( (handle) ->
		handle.ready()
	)
	if isReady and !Session.get('loaded')
		$('body').spin('modal')
		Session.set('loaded', true)

Template.nav.events {
	'tap #new, click #new': (e, template) ->
		if Meteor.userId()
			Session.set('editing', false)
			Session.set('form_visibility', 'visible')
			$('#form')[0].reset()
		else
			alert("Please sign-in first!")
}

Template.nav.helpers {
	totalValue: ->
		total = 0
		Wines.find({ qty: { $gt: '0' }}).map (wine) ->
			qty = parseInt(wine.qty)
			if qty != 'NaN' and qty
				total += qty
		total
	totalWines: ->
		total = 0
		Wines.find({ qty: { $gt: '0' }}).map (wine) ->
			price = parseInt(wine.price) * wine.qty
			if price != 'NaN' and price
				total += price
		accounting.formatMoney total
}

Template.page.helpers {
	hasWines: ->
		Wines.find().count() > 0
}

Template.list.wines = ->
	sort = {}
	sort[Session.get('sort_field')] = Session.get('sort_by')
	Wines.find {}, sort: sort
	# if Session.get('archive')
	# 	Wines.find({ qty: '0' }, sort: sort)
	# else
	# 	Wines.find({ qty: { $gt: '0' }}, sort: sort)

Template.list.events {
	'tap .edit, click .edit': ->
		wine = Wines.findOne({ _id: @_id })

		Session.set('editing', @_id)
		Session.set('form_visibility', 'visible')

		$('#form').populate(wine)

	'tap th a, click th a': (e) ->
		Session.set('sort_field', e.target.id)

		if Session.get('sort_by') is 1
			Session.set('sort_by', -1)
		else
			Session.set('sort_by', 1)
}

Template.form.helpers {
	visibility: ->
		Session.get('form_visibility')
	editing: ->
		Session.get('editing')
	autoCompleteWineries: ->
		"[" + Wineries.find().map((winery) -> '"' + winery.name + '"').join(",") + "]"
	autoCompleteRegions: ->
		"[" + Regions.find().map((region) -> '"' + region.name + '"').join(",") + "]"
	autoCompleteVarieties: ->
		"[" + Varieties.find().map((variety) -> '"' + variety.name + '"').join(",") + "]"
}

Template.form.events {
	'tap #save, click #save': (e, template) ->
		data = $('#form').toObject()

		if Session.get('editing')
			Meteor.call('update', Session.get('editing'), data)
		else
			Meteor.call('create', data)

		Session.set('editing', false)
		Session.set('form_visibility', 'invisible')

	'tap #cancel, click #cancel': (e, template) ->
		Session.set('form_visibility', 'invisible')
		formReset(template)

	'tap #delete, click #delete': (e, template) ->
		if confirm("Are you sure?")
			Meteor.call('remove', Session.get('editing'))
			formReset(template)
}

formReset = (template) ->
	Session.set('editing', false)
	template.find('#form').reset()
	Session.set('form_visibility', 'invisible')
