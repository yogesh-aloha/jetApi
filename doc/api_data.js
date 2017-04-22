define({ "api": [
  {
    "type": "get",
    "url": "/movies/theterical",
    "title": "Request to store theterical data",
    "name": "_movies_theterical",
    "group": "movies",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "null",
            "optional": false,
            "field": "-",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Error",
            "description": "<p>Error if any</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Success",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/movies.js",
    "groupTitle": "movies"
  }
] });