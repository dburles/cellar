Meteor.publish 'wines', ->
  Wines.find
    qty:
      $gt: '0'
    owner: this.userId

Meteor.publish 'archive', ->
  Wines.find 
    qty: '0'
    owner: this.userId

Meteor.publish 'wine', (id) ->
  Wines.find
    _id: id
    owner: this.userId


Meteor.publish 'wineries', (search) ->
	Wineries.find({ name: { $regex: '^' + search, $options: 'i' }}, { limit: 10 }) if search

Meteor.publish 'regions', (search) ->
  Regions.find({ name: { $regex: '^' + search, $options: 'i' }}, { limit: 10 }) if search

Meteor.publish 'varieties', (search) ->
  Varieties.find({ name: { $regex: '^' + search, $options: 'i' }}, { limit: 10 }) if search
