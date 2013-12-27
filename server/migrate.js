// Meteor.startup(function() {
//   var wines = Wines.find({
//     $or: [
//       { qty: { $type: 2 }},
//       { year: { $type: 2 }},
//       { rating: { $type: 2 }}
//     ]
//   });

//   if (wines.count() > 0) {
//     console.log('migration: found ' + wines.count() + ' to update.');
//     wines.forEach(function(wine) {
//       Wines.update(wine._id, { $set: {
//         qty: parseInt(wine.qty, 10),
//         year: parseInt(wine.year, 10),
//         rating: parseInt(wine.rating, 10),
//       }});
//       console.log('updated: ' + wine._id);
//     });
//   }
// });