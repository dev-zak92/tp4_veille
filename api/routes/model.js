const express = require('express');
const fs = require('fs');
const router = express.Router();

const tf = require('@tensorflow/tfjs-node');

router.get('/predict/:xDays&:xAirports&:xPopulation', (req, res) => {
  let dataFile = fs.readFileSync(`${__dirname}\\parseData.json`);
  let data = JSON.parse(dataFile);

  let airportsFile = fs.readFileSync(`${__dirname}\\airports.json`);
  let airports = JSON.parse(airportsFile);

  let populationFile = fs.readFileSync(`${__dirname}\\population.json`);
  let population = JSON.parse(populationFile);

  let { xDays, xAirports, xPopulation } = req.params;

  tf.loadLayersModel(`http://localhost:5000/files/modelNumberOfDays.json`)
    .then((modelDays) => {
      tf.loadLayersModel(
        `http://localhost:5000/files/modelNumberOfAirports.json`
      )
        .then((modelAirports) => {
          tf.loadLayersModel(`http://localhost:5000/files/modelPopulation.json`)
            .then((modelPopulation) => {
              const tensorDataDays = convertDaysToTensor(data);
              const {
                inputMaxDays,
                inputMinDays,
                labelMinDays,
                labelMaxDays,
              } = tensorDataDays;

              const tensorDataAirports = convertAirportsToTensor(airports);
              const {
                inputMaxAirports,
                inputMinAirports,
                labelMinAirports,
                labelMaxAirports,
              } = tensorDataAirports;

              const tensorDataPopulation = convertPopulationToTensor(
                population
              );
              const {
                inputMaxPopulation,
                inputMinPopulation,
                labelMinPopulation,
                labelMaxPopulation,
              } = tensorDataPopulation;

              // Prediction pour les jours
              const tfDays = tf.scalar(parseInt(xDays));
              const normXDays = tfDays
                .sub(inputMinDays)
                .div(inputMaxDays.sub(inputMinDays));
              const predDays = modelDays.predict(normXDays.reshape([1, 1]));
              const unNormPredDays = predDays
                .mul(labelMaxDays.sub(labelMinDays))
                .add(labelMinDays);

              // Prediction pour les airports
              const tfAirports = tf.scalar(parseInt(xAirports));
              const normXAirports = tfAirports
                .sub(inputMinAirports)
                .div(inputMaxAirports.sub(inputMinAirports));
              const predAirports = modelAirports.predict(
                normXAirports.reshape([1, 1])
              );
              const unNormPredAirports = predAirports
                .mul(labelMaxAirports.sub(labelMinAirports))
                .add(labelMinAirports);

              // Prediction pour la population
              const tfPopulation = tf.scalar(parseInt(xPopulation));
              const normXPopulation = tfPopulation
                .sub(inputMinPopulation)
                .div(inputMaxPopulation.sub(inputMinPopulation));
              const predPopulation = modelPopulation.predict(
                normXPopulation.reshape([1, 1])
              );
              const unNormPredPopulation = predPopulation
                .mul(labelMaxPopulation.sub(labelMinPopulation))
                .add(labelMinPopulation);

              let casesDays = unNormPredDays.dataSync();
              let casesAirports = unNormPredAirports.dataSync();
              let casesPopulation = unNormPredPopulation.dataSync();

              let cases =
                (casesDays['0'] + casesAirports['0'] + casesPopulation['0']) /
                3;

              res.json({ cases });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

function convertDaysToTensor(data) {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map((d) => d.date);
    const labels = data.map((d) => d.confirmed);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMaxDays: inputMax,
      inputMinDays: inputMin,
      labelMaxDays: labelMax,
      labelMinDays: labelMin,
    };
  });
}

function convertAirportsToTensor(data) {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map((d) => d.airports);
    const labels = data.map((d) => d.confirmed);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMaxAirports: inputMax,
      inputMinAirports: inputMin,
      labelMaxAirports: labelMax,
      labelMinAirports: labelMin,
    };
  });
}

function convertPopulationToTensor(data) {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map((d) => d.population);
    const labels = data.map((d) => d.confirmed);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMaxPopulation: inputMax,
      inputMinPopulation: inputMin,
      labelMaxPopulation: labelMax,
      labelMinPopulation: labelMin,
    };
  });
}

module.exports = router;
