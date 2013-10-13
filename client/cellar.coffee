Session.setDefault 'form_visibility', 'invisible'
Session.setDefault 'editing', false
Session.setDefault 'sort_field', 'ref'
Session.setDefault 'sort_by', -1
Session.setDefault 'archive', false

Meteor.startup ->
	$('body').spin('modal')
	Session.set 'loaded', false

globalSubscriptionHandles = []
globalSubscriptionHandles.push Meteor.subscribe 'wineries'
globalSubscriptionHandles.push Meteor.subscribe 'regions'
globalSubscriptionHandles.push Meteor.subscribe 'varieties'

Deps.autorun ->
	if Meteor.user()
		globalSubscriptionHandles.push Meteor.subscribe('wines', Meteor.userId(), Session.get 'archive')
	
	isReady = globalSubscriptionHandles.every (handle) -> handle.ready()

	if isReady and not Session.get 'loaded'
		$('body').spin('modal')
		Session.set 'loaded', true
		# autocompletes
		$('input[name="winery"]').typeahead { source: Wineries.find().map (winery) -> winery.name }
		$('input[name="region"]').typeahead { source: Regions.find().map (region) -> region.name }
		$('input[name="type"]').typeahead { source: Varieties.find().map (variety) -> variety.name }

Template.nav.events {
	'click #new': (e, template) ->
		if Meteor.userId()
			Session.set 'editing', false
			Session.set 'form_visibility', 'visible'
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

Template.list.helpers {
	hasWines: ->
		Wines.find().count() > 0

	wines: ->
		sort = {}
		sort[Session.get('sort_field')] = Session.get('sort_by')
		Wines.find {}, sort: sort
}

Template.list.events {
	'click .edit': ->
		wine = Wines.findOne({ _id: @_id })

		Session.set 'editing', @_id
		Session.set 'form_visibility', 'visible'

		$('#form').populate(wine)

	'click th a': (e) ->
		Session.set 'sort_field', e.target.id

		if Session.get('sort_by') is 1
			Session.set 'sort_by', -1
		else
			Session.set 'sort_by', 1
}

Template.form.helpers {
	visibility: ->
		Session.get('form_visibility')
	editing: ->
		Session.get('editing')
}

Template.form.events {
	'click #save': (e, template) ->
		data = $('#form').toObject()

		if Session.get('editing')
			Meteor.call('update', Session.get('editing'), data)
		else
			Meteor.call('create', data)

		Session.set 'editing', false
		Session.set 'form_visibility', 'invisible'

	'click #cancel': (e, template) ->
		Session.set 'form_visibility', 'invisible'
		formReset(template)

	'click #delete': (e, template) ->
		if confirm("Are you sure?")
			Meteor.call('remove', Session.get('editing'))
			formReset(template)
}

formReset = (template) ->
	Session.set 'editing', false
	template.find('#form').reset()
	Session.set 'form_visibility', 'invisible'

Template.list.rendered = ->
	$('.row').packery({
		itemSelector: '.span3'
	});
