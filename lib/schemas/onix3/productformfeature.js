var _ = require('lodash');
var utils = require('../../utils');

module.exports = {
    tag: 'ProductFormFeature',
    array: true,
    fields: {
        'productFormFeatureType': {
            tag: 'ProductFormFeatureType',
            transform: String
        },
        'productFormFeatureValue': {
            tag: 'ProductFormFeatureValue',
            transform: String
        },
        'productFormFeatureDescriptions': {
            tag: 'ProductFormFeatureDescription',
            array: true,
            transform: String
        }
    }
};
