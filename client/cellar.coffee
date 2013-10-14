Session.setDefault 'form_visibility', 'invisible'
Session.setDefault 'editing', false
Session.setDefault 'sort_field', 'ref'
Session.setDefault 'sort_by', -1

Meteor.startup ->
	$('body').spin('modal')
	Session.set 'loaded', false

# hmm :/
globalSubscriptionHandles = []
globalSubscriptionHandles.push Meteor.subscribe 'wineries'
globalSubscriptionHandles.push Meteor.subscribe 'regions'
globalSubscriptionHandles.push Meteor.subscribe 'varieties'
globalSubscriptionHandles.push Meteor.subscribe 'wines', Meteor.userId()

Deps.autorun ->
	isReady = globalSubscriptionHandles.every (handle) -> handle.ready()

	if isReady and not Session.get 'loaded'
		# ew
		$('body').spin('modal')
		Session.set 'loaded', true
		# autocompletes
		# argh
		$('input[name="winery"]').typeahead { source: Wineries.find().map (winery) -> winery.name }
		$('input[name="region"]').typeahead { source: Regions.find().map (region) -> region.name }
		$('input[name="type"]').typeahead { source: Varieties.find().map (variety) -> variety.name }


Template.nav.helpers
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


Template.home.helpers
	wines: ->
		Wines.find
			qty:
				$gt: "0"
		,
			sort:
				ref: -1

Template.archive.helpers
	wines: ->
		Wines.find
			qty: '0'
		,
			sort:
				ref: -1

Template.form.helpers
	quantities: ->
		_.range 25
	# quantities: ->
	# 	wine = Wines.findOne Session.get 'editing'
	# 	obj = []
	# 	_.each _.range(25), (n) ->
	# 		o = {}
	# 		o.val = n
	# 		o.selected = true if n is wine.qty
	# 		obj.push o
	# 	obj

Template.qty.helpers
	selected: (value) ->
		wine = Wines.findOne 
		value is wine.qty



Template.form.events
	'click #save': (e, template) ->
		e.preventDefault()
		data = $('#form').toObject()

		if not data.name
			alert "Name is required"
			return

		if Session.get('editing')
			Meteor.call('update', Session.get('editing'), data)
		else
			Meteor.call('create', data)

	'click #delete': (e, template) ->
		e.preventDefault()
		if confirm("Are you sure?")
			Meteor.call('remove', Session.get('editing'))
			Session.set 'editing', false


Template.list.rendered = ->
	# should be okay.
	if Session.equals 'loaded', true
		new Packery('.row')
