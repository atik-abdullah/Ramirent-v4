'use strict';

const aws = require('aws-sdk');
//DB Connection
require("./src/database/connection");

module.exports.saveFile = async (event, context, callback) => {
  //Require AWS SDK
  const aws = require('aws-sdk');

  //Require models
  const Answer = require("./src/model/Answer");
  const Form = require("./src/model/Form");

  //Create Relations 
  Form.hasMany(Answer, {
    as: "answers",
    foreignKey: "formForeignKeyId"
  });
  Answer.belongsTo(Form, {
    as: "forms",
    foreignKey: "formForeignKeyId"
  });

  //Generic Error Handler 
  const errHandler = err => {
    //Catch and log any error.
    console.error("Error: ", err);
  };

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
    region: 'us-east-1'
  });
  const s3 = new aws.S3();
  var params = {
    Bucket: "e-forms-filled-prod",
    MaxKeys: 10
  };

  /* "response" will for example:
  {
    IsTruncated: true,
    Contents: [
      {
        Key: 'Raw/',
        LastModified: 2019-02-15T12:14:24.000Z,
        ETag: '"d41d8cd98f00b204e9800998ecf8427e"',
        Size: 0,
        StorageClass: 'STANDARD'
      },
      {
        Key: 'Raw/-FI1072-2020-01-24-13_12_43:422.json',
        LastModified: 2020-01-24T11:12:50.000Z,
        ETag: '"09744f7a23c725e180fd3fb95b917f6f"',
        Size: 5226,
        StorageClass: 'STANDARD'
      },
      {
        Key: 'Raw/0000011-FI1020-2020-01-29-17_16_15:874.json',
        LastModified: 2020-01-29T15:16:23.000Z,
        ETag: '"1b7ac62febcec6e4924206e23854bc67"',
        Size: 10796,
        StorageClass: 'STANDARD'
      }
    ],
    Name: 'e-forms-filled-prod',
    Prefix: '',
    MaxKeys: 10,
    CommonPrefixes: [],
    KeyCount: 10,
    NextContinuationToken: '1JLk2m6Qsu4J056oT6FUasgF/sKjPaM+LpXvBmN+CqIGe9CDcV3lbaweCOvd3JiVOUZJeKAKtT+paZmckJSubBki2liYvFIte3QD0NeTbelc='
  }
  */
  const response = await s3.listObjectsV2(params).promise();
  // extract the "Contents" part from the response
  var contentsArr = response.Contents

  /* "resArr" contains for example:
    [
      'Raw/',
      'Raw/-FI1072-2020-01-24-13_12_43:422.json',
      'Raw/0-FI1118-2020-03-23-13_23_49:259.json',
      'Raw/0-FI1118-2020-03-23-13_30_43:910.json',
      'Raw/0000-FI1021-2019-09-10-14_33_28:398.json',
      'Raw/0000-FI1024-2019-09-10-14_29_18:603.json',
      'Raw/0000-FI1118-2020-03-19-13_59_56:857.json',
      'Raw/00000-FI1066-2019-10-21-08_47_25:69.json',
      'Raw/0000001-FI1004-2019-05-03-05:24:36.884.json',
      'Raw/0000011-FI1020-2020-01-29-17_16_15:874.json'
    ]
    */
  var resArr = contentsArr.map(function (x) {
    return x[Object.keys(x)[0]];
  });

  // Loop the array for the total number of JSON files and fetch each JSON file. Start the loop from the 2nd element, because the first entry of the array only contains the folder name e.g. 'Raw/'. The real entry that contains our JSON file name starts fromt the second entry, resArr[1]. 
  for (var i = 1; i < resArr.length; i++) {

    // parameters for our s3.getObject request
    var params = {
      Bucket: "e-forms-filled-prod",
      Key: resArr[i]
    };

    /* The returned response will look following:
    { 
    AcceptRanges: 'bytes',
    LastModified: 2019-07-15T07:47:19.000Z,
    ContentLength: 1250,
    ETag: '"d1dffcbf1e3d7b4b392a54fc88c47b25"',
    ContentType: 'application/octet-stream',
    Metadata: {},
    Body:
        <Buffer 7b 22 76 69 73 69 62 69 6c 69 74 79 22 3a 22 70 72 69 76 61 74 65 22 2c 22 66 6f 72 6d 49 64 22 3a 22 47 52 31 30 30 34 22 2c 22 74 69 74 6c 65 22 3a ... 1200 more bytes> 
    }
    */
    const response = await s3.getObject(params).promise();

    /* Extract the "Body" part of the returned response */
    const dataJSON = response.Body.toString();

    /* Convert the raw "Body" data of the returned response to JSON format */
    const jsonPayload = JSON.parse(dataJSON);

    if (jsonPayload.formId && jsonPayload.title) {

      /* Reference: See sequelize documentation (version 5): Chapter 5 - Model Usage > 1. Data retrieval/Finders > findOrCreate - Search for a specific element in a database*/

      /* findOrCreate returns an array containing the object that was found or created and a boolean that will be true if a new object was created and false if not, like so:
      [ {
          username: 'sdepold',
          job: 'Technical Lead JavaScript',
          id: 1,
          createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
          updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
        },
        true ]*/
      Form.findOrCreate({
          where: { // "where" option will be appended to the "defaults" for create case
            fillId: jsonPayload.fillId
          },
          defaults: {
            title: jsonPayload.title,
            formId: jsonPayload.formId
          }
        })
        .then(([form, created]) => {
          console.log(form);
          // In case of a create, we need to save the JSON form's child element "form" into the Answer table
          if (created) {
            for (var i = 0; i < jsonPayload.form.length; i++) {
              if (jsonPayload.form[i]) {
                Answer.create({
                  label: jsonPayload.form[i].label,
                  value: jsonPayload.form[i].value,
                  formForeignKeyId: form.id
                }).catch(errHandler);
              }
            }
          }
        })
    }
  }
  console.log("Finishing successful");
};