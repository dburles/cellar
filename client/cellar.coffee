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

Deps.autorun ->
	Meteor.subscribe 'wines', Meteor.userId()
	Meteor.subscribe 'archive', Meteor.userId()
	
	isReady = globalSubscriptionHandles.every (handle) -> handle.ready()

	if isReady and not Session.get 'loaded'
		# ew
		$('body').spin('modal')
		Session.set 'loaded', true
		# autocompletes
		# argh
		Template.form.rendered = ->
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
				$gt: '0'
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
	selectOptionsQty: ->
		name: 'qty'
		value: @qty
		options: _.map _.range(25), (qty) -> name: qty, value: qty
	selectOptionsRating: ->
		name: 'rating'
		value: @rating
		options: [{ name: 'None', value: 'None' }].concat _.map _.range(1, 11).reverse(), (rating) -> name: rating, value: rating

Template.select.helpers
	decoratedOptions: ->
		self = this
		_.map self.options, (option) ->
			option.selected = option.value is parseInt self.value
			option


Template.form.events
	'click #save': (e, template) ->
		e.preventDefault()
		data = $('#form').toObject()

		if not data.name
			alert "Name is required"
			return

		if @._id
			Meteor.call('update', @._id, data)
		else
			Meteor.call('create', data)

		Router.go 'home'

	'click #delete': (e, template) ->
		e.preventDefault()
		if confirm("Are you sure?")
			Meteor.call('remove', @._id)
			Router.go 'home'

	'click #cancel': (e, template) ->
		e.preventDefault()
		Router.go 'home'


Template.list.rendered = ->
	# should be okay.
	if Session.equals 'loaded', true
		new Packery('.row')
