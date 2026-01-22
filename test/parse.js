var fs = require('fs');
var should = require('should');
var path = require('path');

var onix = require('../');

describe('Parsing', function () {
    var EPUBDIRECT = fs.readFileSync(path.join(__dirname, './fixtures/epubDirect.onx'), { encoding: 'utf-8' });
    var feed;

    it('should correctly parse xml', function() {
        feed = onix.parse(EPUBDIRECT);
        // console.log(JSON.stringify(feed, null, 4));
        // console.log(onix.create(feed));
    });
});

describe('Parsing ONIX 3', function() {
    var onix3sample = fs.readFileSync(path.join(__dirname, './fixtures/onix3sample.xml'), { encoding: 'utf-8' });
    var o3feed;
    o3feed = onix.parse(onix3sample, '3.0');
    var product = o3feed.products[0];

    it('should correctly parse ONIX 3 xml', function() {
        o3feed.header.sender.name.should.eql('Sender Name');
        product.description.title.element.text.should.eql('The Title');
    });

    it('should find the product ISBN', function() {
      product.ids[0].value.should.eql('978XXXXXXXXXX');
    });

    it('should find the product author', function() {
      product.description.contributors[0].name.should.eql('AuthorFirst AuthorLast');
      product.description.contributors[0].note.should.eql('bio notes');
    });

    it('should find details about the contributors', function() {
      product.description.contributors[0].places.length.should.eql(1);
      product.description.contributors[0].places[0].relator.should.eql(8);
      product.description.contributors[0].places[0].countryCode.should.eql('CA');
      product.description.contributors[0].gender.should.eql('u');
      product.description.contributors[0].dates.length.should.eql(1);
      product.description.contributors[0].dates[0].role.should.eql(50);
      product.description.contributors[0].dates[0].date.should.eql('19880507T174343-0400');
      product.description.contributors[0].websites.length.should.eql(2);
      product.description.contributors[0].websites[1].role.should.eql(42);
      product.description.contributors[0].websites[1].link.should.eql('https://www.twitter.com/author');
      product.description.contributors[0].identifiers.length.should.eql(2);
      product.description.contributors[0].identifiers[1].type.should.eql(16);
      product.description.contributors[0].identifiers[1].value.should.eql('0000000068287141');
      product.description.contributors[0].identifiers[0].typeName.should.eql('XYZ Author ID');
    });

    it('should find the product publisher name', function() {
      product.publishingDetail.publisher.name.should.eql('The Publisher');
    });

    it('should find the publisher identifiers', function() {
      product.publishingDetail.publisher.identifiers.length.should.eql(1);
      product.publishingDetail.publisher.identifiers[0].type.should.eql(1);
      product.publishingDetail.publisher.identifiers[0].typeName.should.eql('Proprietary');
      product.publishingDetail.publisher.identifiers[0].value.should.eql('345');
    });

    it('should find the product publishing status', function() {
      product.publishingDetail.status.should.eql(4);
    });

    it('should find the product availability', function() {
      product.productSupply[0].details[0].availability.should.eql(20);
    });

    it('should find the product supply dates', function() {
      product.productSupply[0].details[0].dates[0].role.should.eql(8);
    });

    it('should find the product prices', function() {
      prices = product.productSupply[0].details[0].prices;
      prices.length.should.eql(45);
      prices[0].type.should.eql(4);
      prices[0].qualifier.should.eql(5);
      prices[0].currency.should.eql('EUR');
      prices[0].amount.should.eql(13.99);  // '13,99' in the ONIX file
      prices[1].amount.should.eql(13.99);  // '13.99' in the ONIX file
      prices[0].territory.countries.should.eql('BG');
      prices[2].dates[0].role.should.eql(14);
      prices[2].dates[0].date.should.eql(new Date(2015, 4, 27))
    });

    it('should find market territory', function() {
      product.productSupply[0].market[0].territory.countries.includes('BE').should.be.true;
    });

    it('should find sales restrictions for product supplies', function() {
      noRestrictions = product.productSupply[0].market[0].salesRestrictions;
      restrictions = product.productSupply[1].market[0].salesRestrictions;
      should.not.exist(noRestrictions);
      restrictions[0].type.should.eql(6);
    });

    it('should find the market publishing status', function() {
      product.productSupply[0].marketPublishingDetail[0].status.should.eql(4);
    });

    it('should find the market date', function() {
      product.productSupply[0].marketPublishingDetail[0].dates[0].role.should.eql(1);
      product.productSupply[0].marketPublishingDetail[0].dates[0].date.should.eql(new Date(2015, 4, 27));
    });

    it('should find the subjects', function() {
      main = product.description.subjects[0];
      main.scheme.should.eql('10');
      main.code.should.eql('FIC050000');
      main.main.should.be.true;

      nonMain = product.description.subjects[1];
      nonMain.main.should.be.false;

      keywords = product.description.subjects[3];
      keywords.text.includes('keyword1').should.be.true;
    });

    it('should find the related products', function() {
      relatedProducts = product.relatedMaterial.relatedProducts;
      relatedProducts.length.should.eql(3);
      relatedProducts[0].productRelationCodes[0].should.eql(31);
      relatedProducts[0].productIdentifiers[0].type.should.eql(1);
      relatedProducts[0].productIdentifiers[0].value.should.eql('some_other_id');
      relatedProducts[0].productForm.should.eql('EA');
      relatedProducts[2].productForm.should.eql('EA');
      relatedProducts[2].productFormDetails.length.should.eql(1);
      relatedProducts[2].productFormDetails[0].should.eql('E107');
    });

    it('should find the product form', function() {
      product.description.productForm.should.eql('EA');
    });

    it('should find the product form details', function() {
      formDetails = product.description.productFormDetails;
      formDetails.length.should.eql(2);
      formDetails[0].should.eql('E101');
    });

    it('should find product form features array', function() {
      features = product.description.productFormFeatures;
      should.exist(features);
      features.should.be.an.instanceOf(Array);
      features.length.should.eql(3);
    });

    it('should parse product form feature type and value', function() {
      features = product.description.productFormFeatures;
      features[0].productFormFeatureType.should.eql('09');
      features[0].productFormFeatureValue.should.eql('11');
      features[2].productFormFeatureType.should.eql('12');
      features[2].productFormFeatureValue.should.eql('14');
    });

    it('should parse product form feature descriptions array', function() {
      features = product.description.productFormFeatures;

      // First feature has no descriptions
      should.not.exist(features[0].productFormFeatureDescriptions);

      // Second feature has multiple descriptions
      features[1].productFormFeatureDescriptions.should.be.an.instanceOf(Array);
      features[1].productFormFeatureDescriptions.length.should.eql(2);
      features[1].productFormFeatureDescriptions[0].should.eql('This ebook has no accessibility features.');
      features[1].productFormFeatureDescriptions[1].should.eql('Additional note about accessibility.');
    });

    it('should find the description text for the product', function() {
      descriptionText = product.collateralDetail.textContent.find(function(tc) {
        return tc.type == '03';
      }).text;
      descriptionText.should.be.an.instanceOf(String).and.have.lengthOf(28);
      descriptionText.should.equal('this book is very very good.');
    });

    it('should find the publishing dates', function() {
      product.publishingDetail.dates.length.should.equal(4);
      product.publishingDetail.dates[0].role.should.equal(1);
      Date.parse(product.publishingDetail.dates[0].date).should.equal(Date.parse('2015-05-27 00:00:00'))
    });

    it('should find the supporting resources', function() {
      product.collateralDetail.supportingResource.length.should.equal(6);
      product.collateralDetail.supportingResource[0].resourceContentType.should.equal(1);
      product.collateralDetail.supportingResource[0].contentAudience.should.equal(0);
      product.collateralDetail.supportingResource[0].resourceMode.should.equal(3);
      product.collateralDetail.supportingResource[0].resourceFeature.length.should.equal(1);
      product.collateralDetail.supportingResource[0].resourceFeature[0].resourceFeatureType.should.equal(2);
      product.collateralDetail.supportingResource[0].resourceFeature[0].featureValue.should.equal('Couverture principale');
      product.collateralDetail.supportingResource[0].resourceVersion.length.should.equal(1);
      product.collateralDetail.supportingResource[0].resourceVersion[0].resourceForm.should.equal(2);
      product.collateralDetail.supportingResource[0].resourceVersion[0].resourceVersionFeature.length.should.equal(4);
      product.collateralDetail.supportingResource[0].resourceVersion[0].resourceVersionFeature[0].resourceVersionFeatureType.should.equal(4);
      product.collateralDetail.supportingResource[0].resourceVersion[0].resourceVersionFeature[0].featureValue.should.equal('filename.jpg');
      product.collateralDetail.supportingResource[0].resourceVersion[0].resourceLink.should.equal('https://www.domain.com/image.jpg');
      product.collateralDetail.supportingResource[0].resourceVersion[0].contentDate.length.should.equal(1);
      product.collateralDetail.supportingResource[0].resourceVersion[0].contentDate[0].contentDateRole.should.equal(17);
      product.collateralDetail.supportingResource[0].resourceVersion[0].contentDate[0].date.should.equal('20150507T174343-0400');
    });

    it('should find the collection', function() {
      product.description.collection.length.should.equal(1);
      product.description.collection[0].collectionType.should.equal(10);
      product.description.collection[0].collectionIdentifier.length.should.equal(1);
      product.description.collection[0].collectionIdentifier[0].collectionIDType.should.equal(1);
      product.description.collection[0].collectionIdentifier[0].idValue.should.equal('CollectionID');
      product.description.collection[0].titleDetail.length.should.equal(1);
      product.description.collection[0].titleDetail[0].titleType.should.equal(1);
      product.description.collection[0].titleDetail[0].titleElement.length.should.equal(1);
      product.description.collection[0].titleDetail[0].titleElement[0].titleElementLevel.should.equal(2);
      product.description.collection[0].titleDetail[0].titleElement[0].titleText.should.equal('Collection name');
    });

    it('should find the prefix and title without prefix', function() {
          product.description.title.element.prefix.should.eql('The');
          product.description.title.element.titleWithoutPrefix.should.eql('Title');
    });
});
