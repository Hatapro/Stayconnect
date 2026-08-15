/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2744374011",
    "maxSelect": 1,
    "name": "state",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "In preparation",
      "Sent",
      "Delivered",
      "Cancelled"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2744374011",
    "maxSelect": 1,
    "name": "state",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "In preparation",
      "Sent",
      "Delivered"
    ]
  }))

  return app.save(collection)
})
