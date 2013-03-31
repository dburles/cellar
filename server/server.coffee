Meteor.publish 'wines', (owner) ->
	Wines.find { owner: owner }
