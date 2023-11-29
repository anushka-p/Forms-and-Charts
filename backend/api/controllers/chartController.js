const fs = require("fs");
const readline = require("readline");
const csv = require("csv-parser");
// let _ = require("lodash");
var csvdb = require("node-csv-query").default;
var databaseConnection = null;
const getHeadings = (filePath) => {
  return new Promise((resolve, reject) => {
    csvdb(filePath).then(function (db) {
      db.find().then(function (records) {
        const headers = Object.keys(records[0]);
        resolve(headers);
      });
    });
  });
};

const getColumnDataTypes = (filePath) => {
  return new Promise((resolve, reject) => {
    csvdb(filePath).then(function (db) {
      db.find().then(function (records) {
        const headers = Object.keys(records[0]);
        const dataTypes = headers.map((header) => {
          const sampleValue = records[0][header];
          if (!isNaN(Number(sampleValue))) {
            return "number";
          } else if (Date.parse(sampleValue)) {
            return "date";
          } else {
            return "string";
          }
        });
        resolve(dataTypes);
      });
    });
  });
};
const uploads = async (req, res) => {
  if (req.file || req.body) {
    let columnDataTypes;
    let filePath;
    try {
      if (req.file) {
        filePath = `./uploads/${req.file.originalname}`;
        columnDataTypes = await getColumnDataTypes(filePath);
      } else {
        filePath = `./uploads/${req.body.filename}`;
        columnDataTypes = await getColumnDataTypes(filePath);
      }
      const headings = await getHeadings(filePath);
      const columnInfo = headings.map((heading, index) => ({
        heading,
        dataType: columnDataTypes[index],
      }));

      res.json({ msg: "Uploaded successfully", columnInfo });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the file" });
    }
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
};

const getAvailableFiles = (req, res) => {
  const uploadsDir = "uploads";

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching available files" });
    }

    const csvFiles = files.filter((file) => file.endsWith(".csv"));
    res.json({ files: csvFiles });
  });
}; //it is okay

// const getChartData = (req, res) => {
//   const { xAxis, yAxis, filename } = req.body;
//   let xaxisPoints = [];
//   let yaxisPoints = [];
//   ("use strict");
//   csvdb(`./uploads/${filename}`).then(function (db) {
//     databaseConnection = db;
//     databaseConnection.find().then(function (records) {
//       xaxisPoints = _.map(records, xAxis);
//       yaxisPoints = _.map(records, (record) => parseInt(record[yAxis]));
//       res.json({ xaxisPoints, yaxisPoints });
//     });
//   });
// };

const getChartData = (req, res) => {
  const { xAxis, yAxis, filename } = req.body;

  // Load the required modules
  const _ = require('lodash');

  csvdb(`./uploads/${filename}`).then(function (db) {
    db.find().then(function (records) {
      // Group records by x-axis values
      const groupedData = _.groupBy(records, xAxis);
      // console.log(groupedData, "groupdata");         
      // Calculate the sum of y-axis values for each group
      const resultData = _.mapValues(groupedData, group => {
        const sum = _.sumBy(group, record => parseInt(record[yAxis]));
        return sum;
      });

      // Convert the result to arrays for x-axis and y-axis
      const xaxisPoints = Object.keys(resultData);
      const yaxisPoints = Object.values(resultData);
      // console.log(xaxisPoints, "xval");
      // console.log(yaxisPoints, "yval");
      res.json({ xaxisPoints, yaxisPoints });
    });
  });
};
module.exports = { uploads, getAvailableFiles, getChartData }; 
