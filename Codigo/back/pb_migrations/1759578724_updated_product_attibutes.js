/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2094403966")

  // update collection data
  unmarshal({
    "name": "product_attributes"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2094403966")

  // update collection data
  unmarshal({
    "name": "product_attibutes"
  }, collection)

  return app.save(collection)
})
