let debug = false;
let view = "Statistics";

let herbivores = [];
let foods = [];
let predators = [];
let mode = "Quadtree";

let logData = [];
let lastLogTime = 0;

function setup() {
  createCanvas(4000, 4000);
  frameRate(120);
  textAlign(LEFT);

  for (let i = 0; i < 500; i++) {
    const rSize = random(0.6, 1.6);
    const rSpeed = random(1.0, 4.5);
    const rAgility = random(0.6, 1.6);
    const rPerception = random(30, 140);

    herbivores.push(
      new Herbivore(
        rSize,
        rSpeed,
        rAgility,
        rPerception,
        rSize ** 3 * 60,
        createVector(random(width), random(height))
      )
    );
  }

  for (let i = 0; i < 20; i++) {
    const rSize = random(0.6, 1.6);
    const rSpeed = random(1.0, 4.5);
    const rAgility = random(0.6, 1.6);
    const rPerception = random(30, 140);

    predators.push(
      new Predator(
        rSize,
        rSpeed,
        rAgility,
        rPerception,
        rSize ** 3 * 60,
        createVector(random(width), random(height))
      )
    );
  }

  for (let i = 0; i < 1000; i++) {
    foods.push(new Food());
  }
}

function draw() {
  background(0);
  
  let hSize = 0;
  let hSpeed = 0;
  let hAgil = 0;
  let hPer = 0;
  let pSize = 0;
  let pSpeed = 0;
  let pAgil = 0;
  let pPer = 0;
  
  for (let i = 0; i < 7; i++) {
    foods.push(new Food());
  }

  if (mode === "Quadtree") {
    //Create QuadTree
    let qt = new QT(new Rectangle(width / 2, height / 2, width, height), 1);

    for (let p of herbivores) {
      qt.insert(p);
    }
    for (let p of foods) {
      qt.insert(p);
    }
    for (let p of predators) {
      qt.insert(p);
    }

    //Draw herbivores -------------------------------------------------------------------------------------------
    for (let p of herbivores) {
      p.query(qt);
      p.consumeEnergy();
      if (p.e < 0) {
        herbivores.splice(herbivores.indexOf(p), 1);
        continue;
      }
      p.checkRepro();
    }

    for (let p of predators) {
      p.query(qt);
      p.consumeEnergy();
      if (p.e < 0) {
        predators.splice(predators.indexOf(p), 1);
        continue;
      }
      p.checkRepro();
    }
    //Show QuadTree if in debug Mode ----------------------------------------------------------------------------
    if (debug) {
      strokeWeight(2);
      stroke(255);
      noFill();
      rectMode(CENTER);

      qt.show();
    }
  } else if (mode === "Global1") {
    //Draw herbivores -------------------------------------------------------------------------------------------
    for (let p of herbivores) {
      p.query2(foods.concat(predators));
      p.consumeEnergy();
      if (p.e < 0) {
        herbivores.splice(herbivores.indexOf(p), 1);
        continue;
      }
      p.checkRepro();
    }

    for (let p of predators) {
      p.query2(herbivores);
      p.consumeEnergy();
      if (p.e < 0) {
        predators.splice(predators.indexOf(p), 1);
        continue;
      }
      p.checkRepro();
    }
  } else if (mode === "Global2") {
    //Draw herbivores -------------------------------------------------------------------------------------------
    for (let p of herbivores) {
      p.query2(foods.concat(predators, herbivores));
      p.consumeEnergy();
      if (p.e < 0) {
        herbivores.splice(herbivores.indexOf(p), 1);
        continue;
      }
      p.checkRepro();
    }

    for (let p of predators) {
      p.query2(foods.concat(predators, herbivores));
      p.consumeEnergy();
      if (p.e < 0) {
        predators.splice(predators.indexOf(p), 1);
        continue;
      }
      p.checkRepro();
    }
  }

  fill(0, 255, 0);
  noStroke();
  for (let p of herbivores) {
    p.show();
    hSize += p.size;
    hSpeed += p.maxSpeed;
    hAgil += p.agility;
    hPer += p.perception;
  }
  fill(255, 0, 0);
  for (let p of predators) {
    p.show();
    pSize += p.size;
    pSpeed += p.maxSpeed;
    pAgil += p.agility;
    pPer += p.perception;
  }
  fill(255);
  for (let p of foods) {
    p.show();
  }
  if (view === "Statistics") {
    const hNo = herbivores.length;
    const pNo = predators.length;
    stroke(255);
    strokeWeight(1);
    fill(255);
    text(`Number of Herbivores: ${hNo}`, 50, 50);
    text(`Number of Predators: ${pNo}`, 50, 75);
    text(
      `Ratio: ${round((hNo / pNo) * 100) / 100}`,
      50,
      100
    );
    text(`FPS: ${round(frameRate())}`, 50, 125);
    text(`Mode: ${mode}`, 50, 150);
    text(`Number of food: ${foods.length}`, 50, 175);
    text(`Mean size (p): ${round(pSize / pNo * 100) / 100}`, 50, 200);
    text(`Mean speed (p): ${round(pSpeed / pNo * 100) / 100}`, 50, 225);
    text(`Mean agility (p): ${round(pAgil / pNo * 100) / 100}`, 50, 250);
    text(`Mean perception (p): ${round(pPer / pNo * 100) / 100}`, 50, 275);
    text(`Mean size (h): ${round(hSize / hNo * 100) / 100}`, 50, 300);
    text(`Mean speed (h): ${round(hSpeed / hNo * 100) / 100}`, 50, 325);
    text(`Mean agility (h): ${round(hAgil / hNo * 100) / 100}`, 50, 350);
    text(`Mean perception (h): ${round(hPer / hNo * 100) / 100}`, 50, 375);
  }

  // Log once per second
  // Log once per second
  if (millis() - lastLogTime >= 1000) {
    lastLogTime = millis();

    const hNo = herbivores.length;
    const pNo = predators.length;

    logData.push({
      time: millis() / 1000,
      fps: frameRate(),
      food: foods.length,
      herbivores: hNo,
      predators: pNo,
      ratio: pNo ? hNo / pNo : 0,

      pMeanSize: pNo ? pSize / pNo : 0,
      pMeanSpeed: pNo ? pSpeed / pNo : 0,
      pMeanAgility: pNo ? pAgil / pNo : 0,
      pMeanPerception: pNo ? pPer / pNo : 0,

      hMeanSize: hNo ? hSize / hNo : 0,
      hMeanSpeed: hNo ? hSpeed / hNo : 0,
      hMeanAgility: hNo ? hAgil / hNo : 0,
      hMeanPerception: hNo ? hPer / hNo : 0
    });
  }
}

function mouseClicked() {
  if (debug) debug = false;
  else debug = true;
}

function keyPressed() {
  if (key === "m") {
    if (view === "Statistics") view = "Visuals";
    else if (view === "Visuals") view = "Statistics";
  }
  if (key === "n") {
    if (mode === "Quadtree") mode = "Global1";
    else if (mode === "Global1") mode = "Global2";
    else if (mode === "Global2") mode = "Quadtree";
  }
  if (key === "s") {
    saveCSV();
  }
}

function saveCSV() {
  let csv =
    "time,fps,food,herbivores,predators,ratio," +
    "pMeanSize,pMeanSpeed,pMeanAgility,pMeanPerception," +
    "hMeanSize,hMeanSpeed,hMeanAgility,hMeanPerception\n";

  for (let row of logData) {
    csv += `${row.time.toFixed(2)},${row.fps.toFixed(3)},${row.food},${row.herbivores},${row.predators},${row.ratio.toFixed(3)},` +
       `${row.pMeanSize.toFixed(3)},${row.pMeanSpeed.toFixed(3)},${row.pMeanAgility.toFixed(3)},${row.pMeanPerception.toFixed(3)},` +
       `${row.hMeanSize.toFixed(3)},${row.hMeanSpeed.toFixed(3)},${row.hMeanAgility.toFixed(3)},${row.hMeanPerception.toFixed(3)}\n`;
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ecosystem_data.csv";
  a.click();

  URL.revokeObjectURL(url);
}
