@Wines = new Meteor.Collection 'wines'
@Wineries = new Meteor.Collection 'wineries'
@Regions = new Meteor.Collection 'regions'
@Varieties = new Meteor.Collection 'varieties'

Wines.allow {
	insert: (userId, doc) ->
		userId && doc.owner == userId
	update: (userId, doc) ->
		userId == doc.owner
	remove: (userId, doc) ->
		userId == doc.owner
	fetch: ['owner']
}

Meteor.methods {
	'create': (data) ->
		data.added = (new Date).getTime()
		data.modified = (new Date).getTime()
		data.owner = @userId
		last = Wines.findOne({ owner: @userId }, { sort: { ref: -1 }})
		if last
			data.ref = parseInt(last.ref) + 1
		else
			data.ref = 1
		Wines.insert(data)
	'update': (wineId, data) ->
		data.modified = (new Date).getTime()
		Wines.update(wineId, { $set: data })
	'remove': (wineId) ->
		Wines.remove(wineId)
}