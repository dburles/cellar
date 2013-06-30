Meteor.publish 'wines', (owner) ->
	Wines.find { owner: owner }

Meteor.publish 'wineries', ->
	Wineries.find()

Meteor.publish 'regions', ->
  Regions.find()

Meteor.publish 'varieties', ->
  Varieties.find()
