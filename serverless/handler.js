'use strict';

const aws = require('aws-sdk');
const Jimp = require("jimp");

module.exports.uploadImage = (event, context, callback) => {
  var params = {
    FunctionName: 'serverless-dev-ResizeImage',
    InvocationType: "Event"
  }
  var sizes = [128, 256, 1024];
  /*
    The "event" contains following:
    {
      Records: [
        {
          eventVersion: '2.1',
          eventSource: 'aws:s3',
          awsRegion: 'us-east-1',
          eventTime: '2020-03-24T09:13:34.124Z',
          eventName: 'ObjectCreated:Put',
          userIdentity: [Object],
          requestParameters: [Object],
          responseElements: [Object],
          s3: [Object]
        }
      ]
    }
    */
  const s3Objects = event['Records'].map(function (r) {
    return r["s3"]
  })
  /* s3Objects contain following:
    [
      {
        s3SchemaVersion: '1.0',
        configurationId: '3c106c18-219c-48da-8285-073a07e60bc2',
        bucket: {
          name: 'sourcebucket105',
          ownerIdentity: [Object],
          arn: 'arn:aws:s3:::sourcebucket105'
        },
        object: {
          key: 'download.jpeg',
          size: 10391,
          eTag: 'b710aa057c83c9897500b1d6a8977527',
          sequencer: '005E79D8156661C3C3'
        }
      }
    ]
    */
  const lambda = new aws.Lambda({
    region: 'us-east-1'
  });

  for (var i = 0; i < sizes.length; i++) {
    params['Payload'] = JSON.stringify({
      "size": sizes[i],
      "s3Objects": s3Objects
    });
    /*
    The "params" contain following:
        {
          FunctionName: 'serverless-dev-ResizeImage',
          InvocationType: 'Event',
          Payload: '{
            "size":1024,
            "s3Objects":[
              {
              "s3SchemaVersion":"1.0",      "configurationId":"3c106c18-219c-48da-8285-073a07e60bc2",
              "bucket":{"name":"sourcebucket105",
                        "ownerIdentity":{"principalId":"A2K9SS4SNHNE04"},"arn":"arn:aws:s3:::sourcebucket105"
              },
              "object":{
                "key":"download.jpeg",
                "size":10391,
                "eTag":"b710aa057c83c9897500b1d6a8977527",
                "sequencer":"005E79D8156661C3C3"
              }
            }
          ]
        }'
        }
        */
    lambda.invoke(params, function (error, data) {
      if (error) {
        callback(error)
      } else {
        callback(null, 'success')
      }
    });
  }
};

module.exports.resizeImage = (event, context, callback) => {
  const size = event.size;
  const S3 = new aws.S3();

  /* The event includes:
    {
      size: 1024,
      s3Objects: [
        {
          s3SchemaVersion: '1.0',
          configurationId: '5c50bdc9-bda8-4fbe-867f-cba9a8aeb303',
          bucket: [Object],
          object: [Object]
        }
      ]
    }
    */
  event.s3Objects.map(function (s3Object) {
    var bucket = s3Object.bucket.name;
    var key = s3Object.object.key;
    var parts = key.split('.');
    var name = parts[0];
    var suffix = parts[1];

    function uploadToS3(err, buffer) {
      const keyName = name + "-" + size + "." + suffix
      var params = {
        Body: buffer,
        Bucket: 'destinationbucket100',
        Key: keyName
      }

      S3.putObject(params, function (err, data) {
        if (err) {
          callback(err);
        } else {
          console.log('successfully uploaded resized image: ' + keyName)
          callback(null, "success");
        }
      })
    }

    S3.getObject({
      Bucket: bucket,
      Key: key
    }, function (err, data) {
      if (err) {
        console.log('Error reading S3 item: ' + bucket + ' ' + key);
      } else {
        Jimp.read(data.Body, function (err, buffer) {
          buffer
            .resize(size, Jimp.AUTO)
            .getBuffer(Jimp.MIME_JPEG, uploadToS3)
        })
      }
    });
    callback(null, "success");
  });
};