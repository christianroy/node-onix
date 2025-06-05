var _ = require('lodash');
var utils = require('../../utils');

module.exports = {
    tag: 'TitleDetail',
    fields: {
        'type': {
            tag: 'TitleType',
            transform: _.partialRight(utils.pad, 2),
            untransform: Number,
            default: 1
        },
        'element': {
            tag: 'TitleElement',
            fields: {
              'level': {
                tag: 'TitleElementLevel',
                transform: _.partialRight(utils.pad, 2),
                untransform: Number,
                default: 1
              },
              'text': {
                tag: 'TitleText',
                cdata: true
              },
              'prefix': {
                tag: 'TitlePrefix'
              },
              'titleWithoutPrefix': {
                tag: 'TitleWithoutPrefix'
              }
            },
            map: {
              to: 'text'
            }
        }
    },
    map: {
        to: 'element'
    }
};
