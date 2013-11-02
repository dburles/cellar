Deps.autorun ->
	Meteor.subscribe 'wineries', Session.get 'winery'
	Meteor.subscribe 'regions', Session.get 'region'
	Meteor.subscribe 'varieties', Session.get 'variety'

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
	varieties: ->
		Varieties.find {}, { sort: name }
	wineries: ->
		Wineries.find {}, { sort: name }
	regions: ->
		Regions.find {}, { sort: name }

Template.select.helpers
	decoratedOptions: ->
		self = this
		_.map self.options, (option) ->
			option.selected = option.value is parseInt self.value
			option

Template.form.events
	'keyup input[name="type"]': (e, template) ->
		if e.target.value.length > 1
			Session.set 'variety', e.target.value 
		else
			Session.set 'variety', ''

	'keyup input[name="winery"]': (e, template) ->
		if e.target.value.length > 1
			Session.set 'winery', e.target.value 
		else
			Session.set 'winery', ''

	'keyup input[name="region"]': (e, template) ->
		if e.target.value.length > 1
			Session.set 'region', e.target.value 
		else
			Session.set 'region', ''

	'click .autocomplete-type a': (e) ->
		Session.set 'variety', ''
		$('input[name="type"]').val e.target.text

	'click .autocomplete-winery a': (e) ->
		Session.set 'winery', ''
		$('input[name="winery"]').val e.target.text

	'click .autocomplete-region a': (e) ->
		Session.set 'region', ''
		$('input[name="region"]').val e.target.text

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
