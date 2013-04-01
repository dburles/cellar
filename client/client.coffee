Session.setDefault('form_visibility', 'invisible')
Session.setDefault('editing', false)
Session.setDefault('sort_field', 'ref')
Session.setDefault('sort_by', -1)

Meteor.autorun ->
	Meteor.subscribe('wines', Meteor.userId())

Template.nav.events {
	'click #new': ->
		if Meteor.userId()
			Session.set('editing', false)
			Session.set('form_visibility', 'visible')
		else
			alert("Please sign-in first!")
}

Template.list.wines = ->
	sort = {}
	sort[Session.get('sort_field')] = Session.get('sort_by')
	Wines.find({}, sort: sort)

Template.list.events {
	'click .edit': ->
		wine = Wines.findOne({ _id: @_id })

		$('#form input[name="qty"]').val(wine.qty)
		$('#form input[name="region"]').val(wine.region)
		$('#form input[name="type"]').val(wine.type)
		$('#form input[name="winery"]').val(wine.winery)
		$('#form input[name="name"]').val(wine.name)
		$('#form input[name="year"]').val(wine.year)
		$('#form input[name="description"]').val(wine.description)
		$('#form input[name="drink_by"]').val(wine.drink_by)
		$('#form input[name="purchased"]').val(wine.purchased)
		$('#form input[name="price"]').val(wine.price)
		$('#form select[name="rating"]').val(wine.rating)
		$('#form textarea[name="notes"]').val(wine.notes)

		Session.set('editing', @_id)
		Session.set('form_visibility', 'visible')

	'click .remove': ->
		if confirm("Are you sure?")
			Meteor.call('remove', @_id)

	'click th a': (e) ->
		Session.set('sort_field', e.target.id)

		if Session.get('sort_by') == 1
			Session.set('sort_by', -1)
		else
			Session.set('sort_by', 1)
}

Template.form.visibility = ->
	Session.get('form_visibility')

Template.form.events {
	'submit #form': (e, template) ->
		e.preventDefault()

		data = {
			qty: template.find('input[name="qty"]').value,
			region: template.find('input[name="region"]').value,
			type: template.find('input[name="type"]').value,
			winery: template.find('input[name="winery"]').value,
			name: template.find('input[name="name"]').value,
			year: template.find('input[name="year"]').value,
			description: template.find('input[name="description"]').value,
			drink_by: template.find('input[name="drink_by"]').value,
			purchased: template.find('input[name="purchased"]').value,
			price: template.find('input[name="price"]').value,
			rating: template.find('select[name="rating"]').value,
			notes: template.find('textarea[name="notes"]').value,
		}

		if Session.get('editing')
			Meteor.call('update', Session.get('editing'), data)
		else
			Meteor.call('create', data)

		template.find('#form').reset()
		Session.set('form_visibility', 'invisible')

	'click #cancel': (e, template) ->
		Session.set('form_visibility', 'invisible')
		Session.set('editing', false)
		template.find('#form').reset()
}