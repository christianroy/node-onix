var _ = require('lodash');
var utils = require('../../utils');

module.exports = {
    tag: 'Contributor',
    array: true,
    fields: {
        sequence: {
            tag: 'SequenceNumber',
            untransform: Number,
            default: 1
        },
        role: {
            tag: 'ContributorRole',
            default: 'A01'
        },
        name: {
            tag: 'PersonName'
        },
        nameInverted: {
            tag: 'PersonNameInverted'
        },
        note: {
            tag: 'BiographicalNote',
            cdata: true
        },
        gender: {
          tag: 'Gender'
        },
        namesBeforeKey: {
          tag: 'NamesBeforeKey'
        },
        keyNames: {
          tag: 'KeyNames'
        },
        places: {
            array: true,
            tag: 'ContributorPlace',
            fields: {
                relator: {
                  tag: 'ContributorPlaceRelator', // list 151
                  transform: _.partialRight(utils.pad, 2),
                  untransform: Number,
                },
                countryCode: {
                  tag: 'CountryCode' // list 91
                },
                regionCode: {
                  tag: 'RegionCode' // list 49
                },
                name: {
                  tag: 'LocationName'
                }
            }
        },
        dates: {
          array: true,
          tag: 'ContributorDate',
          fields: {
              role: {
                tag: 'ContributorDateRole', // list 177
                transform: _.partialRight(utils.pad, 2),
                untransform: Number,
              },
              date: {
                tag: 'Date'
              }
          }
        },
        websites: {
          array: true,
          tag: 'Website',
          fields: {
            role: {
              tag: 'WebsiteRole',
              transform: _.partialRight(utils.pad, 2),
              untransform: Number
            },
            link: {
              tag: 'WebsiteLink'
            }
          }
        },
        identifiers: {
          array: true,
          tag: 'NameIdentifier',
          fields: {
            type: {
              tag: 'NameIDType', // list 44
              transform: _.partialRight(utils.pad, 2),
              untransform: Number
            },
            typeName : {
              tag: 'IDTypeName'
            },
            value: {
              tag: 'IDValue'
            }
          }
        }
    }
};
