var playBtn, playBtnImg;
var ground, groundImg;
var BG, BGImg
var cactus,cactusImg;
var trex,trexImg1,trexImg2;
var invisibleGround;
var cloud,cloudImg;
var resetBtn,resetBtnImg;
var arrow,arrowImg;

var restartBtn,restartBtnImg;

var cactiG;
var cloudG

var score;

var index = 0;


var SERVE = 2
var PLAY = 1
var END = 0
var gameState = SERVE

function preload(){
  playBtnImg = loadImage("play.png");
  groundImg = loadImage("ground.png");
  BGImg = loadImage("BG.jpg");
  cactusImg = loadImage("cactus.png");
  trexImg1 = loadAnimation("trex.gif");
  trexImg2 = loadAnimation("trex_stopped.png");
  cloudImg = loadImage("cloud.png");
  restartBtnImg = loadImage("retry.png")
  resetBtnImg = loadImage("reset.png");
  arrowImg = loadImage("arrow.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight)
  
  playBtn = createSprite(width/2,height/2)
  playBtn.addImage(playBtnImg)
  playBtn.scale = width / width / 1.3
  playBtn.visible = false  

  BG = createSprite(width/2,height,width*6,height);
  BG.addImage(BGImg);
  BG.scale = 3
 // BG.x = width/2
  
  ground = createSprite(-1000,height-175,width*100,50);
  ground.addImage(groundImg);
  //ground.x = ground.width/2

  

  
  trex = createSprite(120,height - height/6);
  trex.addAnimation("trex_running",trexImg1);
  trex.addAnimation("trex_stopped",trexImg2)
  trex.scale = 0.7
  
  invisibleGround = createSprite(width/2,height - height/12,width,5);
  invisibleGround.visible = false;
  
  cactiG = new Group();
  cloudG = new Group();
  
  //trex.debug = true
  trex.setCollider("rectangle",60,0,200,150);
  
  restartBtn = createSprite(trex.x, height/2);
  restartBtn.addImage(restartBtnImg);
  restartBtn.scale = 0.3;
  restartBtn.visible = false
  
  resetBtn = createSprite(trex.x,height/4);
  resetBtn.addImage(resetBtnImg);
  resetBtn.scale = 0.5;
  resetBtn.visible = false
  //resetBtn.debug = true;
  resetBtn.setCollider("rectangle",-20,-5,500,150);
  
  arrow = createSprite(width/2,height*0.4);
  arrow.addImage(arrowImg);
  arrow.scale = 0.3
  
  
  score = 0;
}

function draw() {
  background("white")
  console.log(ground.x)
  
  index = index + 1

  if(gameState === SERVE){
    playBtn.visible = true
    playBtn.x = camera.x
    ground.visible = false
    BG.visible = false;
    trex.visible = false
    arrow.visible = false
    
  if(touches.length > 0){
    if(playBtn.overlapPoint(touches[0].x,touches[0].y)){
      gameState = PLAY
      playBtn.visible = false
    }
  }
    
    if(mousePressedOver(playBtn) || keyDown("space")||keyDown("enter")){
      gameState = PLAY
      playBtn.visible = false
      trex.x = 120
    }
    
  }
  
  if(gameState === PLAY){
    //trex.velocityX = (4 + score / 100)
    ground.velocityX = -(8 + score/100)
    
    score = score + (Math.round(getFrameRate() / 60))

    camera.position.x = trex.x/* + 550*/;
    camera.position.y = trex.y - 195; 
    spawnCacti();
    spawnClouds();
    
    ground.visible = true
    BG.visible = true
    trex.visible = true
    arrow.visible = true
    
    if(ground.x < 90 ){
      ground.x = ground.width/2.8
    }
    
    if(keyDown("space") && trex.y > height - 130){
      trex.velocityY = -19;
    }
    
    if(mousePressedOver(arrow) && trex.y > height - 130){
      trex.velocityY = -19;
    }
  if(touches.length > 0) {
    if(arrow.overlapPoint(touches[0].x,touches[0].y) && trex.y > height - 130){
      trex.velocityY = -19;
    }
  }
    
    if(trex.y < height - height/5){
      trex.changeAnimation("trex_stopped",trexImg2)
      trex.scale = 0.3
    }
    
    if(trex.y > height-height/5){
      trex.changeAnimation("trex_running",trexImg1);
      trex.scale = 0.7;
    }
  
  trex.velocityY = trex.velocityY + 0.9
  trex.collide(invisibleGround);
    


    if(trex.isTouching(cactiG)){
      gameState = END;
    }
    
  }
  
  if(gameState === END){
    
    restartBtn.visible = true;
    resetBtn.visible = true
    arrow.visible = false;
    
    trex.changeAnimation("trex_stopped",trexImg2);
    trex.scale = 0.315;
    trex.setCollider("rectangle",60,0,600,350);
    trex.y = height - height/6.3
    trex.velocityX = 0
    
    ground.velocityX = 0;
    cactiG.destroyEach();
    BG.velocityX = 0;
    cloudG.destroyEach();
  
  if(touches.length > 0){
    if(restartBtn.overlapPoint(touches[0].x,touches[0].y)){
      gameState = PLAY
      reset();
    }
  }
    
  if(keyDown("r") || mousePressedOver(restartBtn)){
    gameState = PLAY;
    reset();
  }
    
  if(touches.length > 0){
    if(resetBtn.overlapPoint(touches[0].x,touches[0].y)){
      gameState = SERVE
      restart();
    }
  }
  
  if(keyDown("s") || mousePressedOver(resetBtn)){
    gameState = SERVE;
    restart();
  }
  
  }
  
 drawSprites();
  
  if(gameState === SERVE){
    textAlign(CENTER);
    fill("green");
    textSize(35)
    text("Click on the button above to begin playing!",camera.x,height/2+150);
    fill("orange");
    textSize(25)
    text("In the game, press 'space' or click on the upwards arrow to jump!",camera.x,height/2 - 150);
  }

  if(gameState === PLAY){

        textAlign(CENTER)
        fill("white");
        textSize(40)
        text("Distance: " + score,trex.x,100);
  }
  
  if(gameState === END){
    textSize(35);
    textAlign(CENTER)
    fill("lightgreen");
    text("Good Job! you covered a distance of " + score,camera.x,height/7);

    fill("blue");
    textAlign(CENTER);
    textSize(20);
    text("Click on the 'reset' button above to start again and the 'restart' button to retry",trex.x,height/2);

  


  }
}
function restart(){
  trex.x = 120
  trex.y = 200
  score = 0;
  restartBtn.visible = false;
  resetBtn.visible = false;
  playBtn.visible = true;
  trex.visible = true;

  trex.setCollider("rectangle",60,0,200,150);
  
}

function reset(){
  trex.x = 120
  trex.y = 200
  score = 0
  restartBtn.visible = false
  resetBtn.visible = false
  ground.visible = false
  cactiG.visibleEach = false
  cloudG.visibleEach = false
  trex.visible = false
  trex.setCollider("rectangle",60,0,200,150);
  
}

function spawnCacti(){
  if(frameCount % 150 === 0){
    cactus = createSprite(width + 10,height - height/6.3);
    cactus.addImage(cactusImg);
    cactus.scale = 0.4
    cactus.velocityX = -(8 + score / 100);
    
    cactus.lifetime = width/-10
    
    cactiG.add(cactus)
  }
}

function spawnClouds(){
  if(frameCount % 250 === 0){
    cloud = createSprite(width + 10,70);
    cloud.addImage(cloudImg);
    cloud.scale = 0.3
    cloud.velocityX = -(8 + score / 100);
    
    cloudG.add(cloud);
    
    cloud.y = Math.round(random(0,height/2))
  }
}
