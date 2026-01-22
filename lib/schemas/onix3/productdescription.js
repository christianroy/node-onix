var _ = require('lodash');
var utils = require('../../utils');

var ProductFormFeature = require('./productformfeature');
var Title = require('./title');
var Contributor = require('./contributor');
var Language = require('./language');
var Subject = require('./subject');
var Collection = require('./collection');

module.exports = {
    tag: 'DescriptiveDetail',
    fields: {
        'productForm': {  // Block P.3.2
          tag: 'ProductForm',
          transform: String
        },
        'productFormDetails': {   // Block P.3.3
          tag: 'ProductFormDetail',
          transform: String,
          array: true
        },
        'productFormFeatures': ProductFormFeature, // Block P.3.4
        'collection': Collection, // Group P.5
        'title': Title, // Group P.6
        'contributors': Contributor, // Group P.7
        'languages': Language, // Group P.10
        'subjects': Subject
    }, map: {
      to: 'title'
    }
};
