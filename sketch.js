var dog, happyDog, database, foodS, foodStock;
var dog_Image, happyDog_Image;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var count;
var playerCount = 0;
var form, player;
var bottle, bottl_img;

function preload(){

  dog_Image = loadImage("dogImg.png");
  happyDog_Image = loadImage("dogImg1.png");
  bottl_img = loadImage("Milk.png");

}

function setup() {

  createCanvas(500, 500);
  dog = createSprite(400, 250, 30, 30);
  dog.addImage(dog_Image, "dgimage");
  dog.scale = 0.2;

  database = firebase.database();

  foodObj = new Foodmilk();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the Dog");
  feed.position(600, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(700, 95);
  addFood.mousePressed(addFoods);

}


function draw() {  

  background(46, 139, 87)

  foodObj.display();
  
  //refer to fedtime, create a listener
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill(255, 255, 254);
  textSize(15);

  if(lastFed >= 12){
    text("Last Feed : " + lastFed, + " PM", 350, 30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM", 350, 30);
  }else{
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  drawSprites();

}

//create readStock
function readStock(data){
  foodS = data.val();
  //foodObj.getFoodStock();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){

  dog.addImage(happyDog_Image);

  bottl = createSprite(dog.x-50, dog.y, 10, 10);
  bottl.addImage("botl", bottl_img);
  bottl.scale = 0.1;
  bottl.visibile = true;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })

}

function addFoods(){
  foodS += 1;
  database.ref('/').update({
    Food : foodS
  })
}