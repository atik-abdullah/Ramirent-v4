'use strict';

const aws = require('aws-sdk');
const Jimp = require("jimp");
//DB Connection
require("./src/database/connection");

module.exports.uploadImage = async (event, context, callback) => {
  console.log("Entering successful");

  //Require models
  const Answer = require("./src/model/Answer");
  const Form = require("./src/model/Form");
  //Create Relations 
  Form.hasMany(Answer, {
    as: "answers",
    foreignKey: "userForeignKeyId"
  });
  Answer.belongsTo(Form, {
    as: "forms",
    foreignKey: "userForeignKeyId"
  });

  //Generic Error Handler 
  const errHandler = err => {
    //Catch and log any error.
    console.error("Error: ", err);
  };
  //create returns a promise which gets resolved to the user instance 
  //We also use await, you can use standard then callback.
  const form = await Form.create({
    formId: "alexdmc1",
    title: "1234567890"
  }).catch(errHandler); ///< Catch any errors that gets thrown
  //You must provide the userId to get each tweet linked to a single user.
  const answer = await Answer.create({
    label: "This is One of the form answer",
    userId: form.id
  }).catch(errHandler);
  console.log("Finishing successful");


};


module.exports.resizeImage = (event, context, callback) => {};