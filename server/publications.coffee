Meteor.publish 'wines', (owner) ->
  Wines.find
    qty:
      $gt: '0'
    owner: owner

Meteor.publish 'archive', (owner) ->
  Wines.find 
    qty: '0'
    owner: owner


Meteor.publish 'wineries', ->
	Wineries.find()

Meteor.publish 'regions', ->
  Regions.find()

Meteor.publish 'varieties', ->
  Varieties.find()

# Meteor.publish 'varieties', search ->
#   Varieties.find({ name: { $regex: search, $options: 'i' }})
