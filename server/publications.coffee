Meteor.publish 'wines', (owner, archive) ->
	if archive
    Wines.find { qty: '0', owner: owner }
  else
    Wines.find { qty: { $gt: '0' }, owner: owner }

Meteor.publish 'wineries', ->
	Wineries.find()

Meteor.publish 'regions', ->
  Regions.find()

Meteor.publish 'varieties', ->
  Varieties.find()
