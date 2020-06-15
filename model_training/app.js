// const fs = require('fs');
// function parseData() {
//   let rawdata = fs.readFileSync('data.json');
//   let covid = JSON.parse(rawdata);

//   let air = fs.readFileSync('populationRaw.json');
//   let airports = JSON.parse(air);

//   var covidArray = {};

//   for (let country in covid) {
//     covid[country].forEach((days, index) => {
//       // covidArray.push({
//       //   confirmed: days.Confirmed,
//       //   country: country,
//       // })

//       covidArray[country] = days.Confirmed;
//     });
//   }

//   let airObj = [];
//   airports.forEach((el) => {
//     if (
//       covidArray[el.country.toLowerCase()] !== null &&
//       covidArray[el.country.toLowerCase()] > 0
//     ) {
//       airObj.push({
//         confirmed: covidArray[el.country.toLowerCase()],
//         population: el.Year_2016,
//       });
//     }
//   });

//   fs.writeFile('population.json', JSON.stringify(airObj), function (err) {
//     if (err) return console.log(err);
//     console.log('Hello World > helloworld.txt');
//   });
// }
// parseData();

function createModel() {
  // Create a sequential model
  const model = tf.sequential();

  // Add a single input layer
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  model.add(
    tf.layers.dense({ units: 16, activation: 'sigmoid', useBias: true })
  );
  model.add(
    tf.layers.dense({ units: 16, activation: 'sigmoid', useBias: true })
  );
  model.add(
    tf.layers.dense({ units: 16, activation: 'sigmoid', useBias: true })
  );
  // Add an output layer
  model.add(tf.layers.dense({ units: 1, useBias: true }));

  return model;
}

async function trainModel(model, inputs, labels) {
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  const batchSize = 32;
  const epochs = 1000;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] }
    ),
  });
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
function convertToTensor(data) {
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
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

function testModel(model, inputData, normalizationData) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100);

    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);

    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] };
  });

  const originalPoints = inputData.map((d) => ({
    x: d.population,
    y: d.confirmed,
  }));

  tfvis.render.scatterplot(
    { name: 'Model Predictions vs Original Data' },
    {
      values: [originalPoints, predictedPoints],
      series: ['original', 'predicted'],
    },
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300,
    }
  );
}

async function run() {
  var data = await fetch('http://localhost:5500/population.json');
  data = await data.json();
  const values = data.map((d) => ({
    x: d.population,
    y: d.confirmed,
  }));

  tfvis.render.scatterplot(
    { name: 'population vs confirmed ' },
    { values },
    {
      xLabel: 'population',
      yLabel: 'confirmed',
      height: 500,
      width: 500,
    }
  );

  const model = createModel();
  tfvis.show.modelSummary({ name: 'Model Summary' }, model);

  // Convert the data to a form we can use for training.
  const tensorData = convertToTensor(data);
  const { inputs, labels } = tensorData;

  // Train the model
  await trainModel(model, inputs, labels);
  console.log('Done Training');

  await model.save('downloads://modelPopulation');

  // const model = await tf.loadLayersModel('http://localhost:5500/model.json');
  // tfvis.show.modelSummary({ name: 'Model Summary' }, model);
  // const tensorData = convertToTensor(data);

  // Make some predictions using the model and compare them to the
  // original data
  testModel(model, data, tensorData);
}

document.addEventListener('DOMContentLoaded', run);
