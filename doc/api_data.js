define({ "api": [
  {
    "type": "get",
    "url": "/movies/theterical",
    "title": "",
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
  },
  {
    "type": "post",
    "url": "/videos/views",
    "title": "views",
    "name": "_getYMAL",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "video_id",
            "description": "<p>Video id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "device_id",
            "description": "<p>Device id</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "get",
    "url": "/videos/details",
    "title": "details",
    "name": "_get_details",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "Id",
            "description": "<p>Video Id</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "get",
    "url": "/videos/likes/id",
    "title": "likes",
    "name": "_get_likes",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "Id",
            "description": "<p>Video Id</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "get",
    "url": "/videos",
    "title": "list",
    "name": "_get_list",
    "group": "videos",
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "get",
    "url": "/videos/search",
    "title": "search",
    "name": "_get_search",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>parameter to search in video.</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "get",
    "url": "/videos/sort",
    "title": "sort",
    "name": "_get_sort",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>genre,release_date,title,contributors</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "subType",
            "description": "<p>asc or desc</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "get",
    "url": "/videos/views/id",
    "title": "views",
    "name": "_get_views",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Video ID.</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "get",
    "url": "/videos/ymal",
    "title": "YMAL",
    "name": "_get_ymal",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "Id",
            "description": "<p>Video Id</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  },
  {
    "type": "post",
    "url": "/videos/likes",
    "title": "likes",
    "name": "_post_likes",
    "group": "videos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "video_id",
            "description": "<p>Video id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "device_id",
            "description": "<p>Device id</p>"
          },
          {
            "group": "Parameter",
            "type": "bollean",
            "optional": false,
            "field": "like",
            "description": "<p>Like / Dislike</p>"
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
    "filename": "routes/videos.js",
    "groupTitle": "videos"
  }
] });
