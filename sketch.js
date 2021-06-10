var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;

function preload() {
  sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(300, 300, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(450, 115);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(550, 115);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  fill(255, 255, 254);
  textSize(15);

  text("Food Stock : " + foodObj.getFoodStock(), 225, 50);

  if (lastFed >= 12) {
    text("Last Feed : " + lastFed % 12 + " PM", 100, 50);
  } else if (lastFed == 0) {
    text("Last Feed : 12 AM", 350, 30);
  } else {
    text("Last Feed : " + lastFed + " AM", 100, 50);
  }

  drawSprites();
}


function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}



function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}


function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
