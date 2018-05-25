// Digital Slaughter Simulator

var f = 0;
var date;
var money = 1000*20;
var health = 100.0;
var wave = 1;
var timer = 60*60;

var enemies = [];
var towers = [];
var bullets = [];

var CIRCLE_SIZE = 450;
var mouseIsClicked = false;

var BG_COLOR = color(222, 220, 180)

var TOWERS = [
    {// Gunner
        name : "Gunner",
        range : 110,
        reloadInterval : 15,
        damage : 15,
        speed : 0.6,
        time : 19*60*60,
        price : 250*20,
    },
    {// Destroyer
        name : "Destroyer",
        range : 110,
        reloadInterval : 55,
        damage : 70,
        speed : 0.4,
        time : 20*60*60,
        price : 250*20,
    },
    {// Quad
        name : "Quad",
        range : 100,
        reloadInterval : 20,
        damage : 15,
        speed : 0.8,
        time : 16*60*60,
        price : 250*20,
    },
    {// Sniper
        name : "Sniper",
        range : 140,
        reloadInterval : 30,
        damage : 35,
        speed : 1.7,
        time : 23*60*60,
        price : 250*20,
    },
    {// Laser
        name : "Laser",
        range : 115,
        reloadInterval : 7,
        damage : 4,
        speed : 0.8,
        time : 17.5*60*60,
        price : 250*20,
    },
    {// Mini-gunner
        name : "Mini-gunner",
        range : 35,
        reloadInterval : 15,
        damage : 10,
        speed : 0.6,
        time : 10*60*60,
        price : 50*20,
    },
    {// Spread
        name : "Spread",
        range : 100,
        reloadInterval : 30,
        damage : 3,
        speed : 0.8,
        time : 15*60*60,
        price : 250*20,
    },
    {// Time Bomb
        name : "Time Bomb",
        range : 160,
        reloadInterval : 60*40,
        damage : 20,
        speed : 0.8,
        time : 4*60*60,
        price : 50*20,
    },
    {// Striker
        name : "Striker",
        range : 180,
        reloadInterval : 65,
        damage : 55,
        speed : 2.7,
        time : 13*60*60,
        price : 350*20,
    },
    {// Grapeshot
        name : "Grapeshot",
        range : 100,
        reloadInterval : 40,
        damage : 2,
        speed : 0.8,
        time : 15*60*60,
        price : 250*20,
    },
];

function setup() {
    // almost impossible
    // punishing failiure
    
    document.addEventListener('contextmenu', event => event.preventDefault());
    createCanvas(windowWidth, windowHeight);
    width = windowWidth;
    height = windowHeight;
    angleMode(DEGREES)
    date = new Date();
}

var DISCOURAGING_COMMENTS = ["You probably won't finish this game", "Try pressing some numbers", "Keep it open in a seperate window", "It takes 24 hours", "You just can't", "You do need to sleep", "Give up", "Are you waiting for money?"];

function draw() {
    background(BG_COLOR);
    
    fill(0,0,0);
    noStroke();
    textAlign(LEFT,TOP)
    text(round(money).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "$\n" + Math.round(health*100)/100 + "%\n" + "Wave " + wave + "/24\n" + floor(timer/60) + ":" + timer%60,10,10);
    push();
    textAlign(RIGHT,TOP);
    text("Keep this tab open in a seperate window\nMaybe bookmark it too",width-10,10);
    pop();
    
    var START_LINE = 10+5*15;
    var END_LINE = height-10-2*15;
    
    stroke(0,0,0,20);
    fill(0,0,0,20);
    strokeWeight(1);
    line(10,START_LINE,10,END_LINE);
    stroke(0,0,0)
    line(10,START_LINE,10,START_LINE+(END_LINE-START_LINE)*((wave-timer/3600)/24));
    
    textAlign(LEFT,CENTER);
    for(var i = 0; i <= 8; i++) {
        noStroke();
        fill(0,0,0,100);
        var yPos = round(START_LINE+(END_LINE-START_LINE)*i/8);
        text(round(date.getHours()+24*i/8)%12+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()),15,yPos)
        stroke(0,0,0,50)
        line(5,yPos,15,yPos);
    }
    noStroke();
    textAlign(LEFT,BOTTOM);
    //text((date.getHours()+24)%12+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()),15,height-10-15)
    fill(0,0,0);
    var currKey = parseInt(key)<TOWERS.length?parseInt(key):0;
    var currTower = TOWERS[currKey];
    text("["+currKey+"] - " + currTower.name + " (" + round(currTower.time/3600) + " minutes for $" + currTower.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")",10,height-10)
    push();
    textAlign(RIGHT,BOTTOM);
    text(DISCOURAGING_COMMENTS[floor(f/300)%DISCOURAGING_COMMENTS.length],width-10,height-10);
    pop();
    
    noFill();
    stroke(0,0,0,100);
    strokeWeight(1);
    //rect(width/2-(height-100)/2,height/2-(height-100)/2,height-100,height-100)
    ellipse(width/2,height/2,CIRCLE_SIZE,CIRCLE_SIZE)
    
    // run enemies
    for(var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var distFromCenter = dist(enemy.x,enemy.y,width/2,height/2);
        noStroke();
        push();
        if(distFromCenter>CIRCLE_SIZE*4/10) {
            var flash = sin(f*10+i*60)*80;
            fill(50+flash,50+flash,50+flash,255*enemy.health/100);
        } else {
            fill(50,50,50,255*enemy.health/100);
        }
        translate(enemy.x,enemy.y)
        rotate(enemy.angle)
        rect(-2.5,-2.5,5,5);
        pop();
        enemy.x = enemy.x + cos(enemy.angle) * -1 * enemy.speed;
        enemy.y = enemy.y + sin(enemy.angle) * -1 * enemy.speed;
        
        // remove enemy if necessary
        if(enemy.health<=0) {
            enemies.splice(i,1);
            i--;
        }
        if(distFromCenter>CIRCLE_SIZE/2+5+1) {
            health -= enemy.damage;
            enemies.splice(i,1);
            i--;
        }
    }
    
    // run bullets
    for(var i = 0; i < bullets.length; i++) {
        var bullet =  bullets[i];
        noStroke();
        push();
        fill(50,50,50);
        translate(bullet.x,bullet.y)
        rotate(bullet.angle)
        //scale(bullet.damage*10/100)
        rect(-2.5,-2.5,5,5);
        pop();
        bullet.x = bullet.x + cos(bullet.angle) * -1 * bullet.speed;
        bullet.y = bullet.y + sin(bullet.angle) * -1 * bullet.speed;
        
        var killThisBullet = dist(bullet.x,bullet.y,width/2,height/2)>CIRCLE_SIZE/2+5+1;
        for(var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            if(dist(bullet.x,bullet.y,enemy.x,enemy.y)<5) {
                enemy.health-=bullet.damage;
                killThisBullet = true;
            }
        }
        
        // remove enemy if necessary
        if(killThisBullet) {
            bullets.splice(i,1);
            i--;
        }
    }
    
    noFill();
    stroke(BG_COLOR);
    strokeWeight(10);
    ellipse(width/2,height/2,CIRCLE_SIZE+12,CIRCLE_SIZE+12)
    
    // run towers
    for(var i = 0; i < towers.length; i++) {
        var tower = towers[i];
        noStroke();
        push();
        fill(50,50,50);
        translate(tower.x,tower.y);
        rotate(tower.angle);
        ellipse(0,0,10,10);
        fill(50,50,50,20);
        ellipse(0,0,tower.range,tower.range);
        pop();
        fill(50,50,50,15)
        arc(tower.x,tower.y,tower.range,tower.range,-90,-90+360*tower.time/tower.TOTAL_TIME);
        
        if(f%tower.reloadInterval === 0) {
            var angle = null;
            for(var j = 0; j < enemies.length; j++) {
                if(dist(tower.x,tower.y,enemies[j].x+2.5,enemies[j].y+2.5)<tower.range/2) {
                    switch(tower.towerType) {
                        case 3:
                            angle = atan2(enemies[j].y+random(-5,5)+2.5-tower.y,enemies[j].x+random(-5,5)+2.5-tower.x)-180;
                            break;
                        default:
                            angle = atan2(enemies[j].y+2.5-tower.y,enemies[j].x+2.5-tower.x)-180;
                            break;
                    }
                }
            }
            if(angle != null) {
                switch(tower.towerType) {
                    case 0:
                        spawnBullet(tower.x,tower.y,angle+random(-20,20),tower.speed, tower.damage);
                        break;
                    case 2:
                        for(var angleInc = 0; angleInc < 360; angleInc+=90) {
                            spawnBullet(tower.x,tower.y,angle+angleInc,tower.speed, tower.damage);
                        }
                        break;
                    case 6:
                        for(var angleInc = -22.5; angleInc < 22.5; angleInc+=5) {
                            spawnBullet(tower.x,tower.y,angle+angleInc,tower.speed, tower.damage);
                        }
                        break;
                    case 7:
                        for(var angleInc = -180; angleInc < 180; angleInc+=3) {
                            spawnBullet(tower.x,tower.y,angle+angleInc,tower.speed, tower.damage);
                        }
                        break;
                    case 9:
                        for(var angleInc = -10; angleInc < 10; angleInc+=1) {
                            spawnBullet(tower.x,tower.y,angle+angleInc,tower.speed+random(-0.2,0.2), tower.damage);
                        }
                        break;
                    default:
                        spawnBullet(tower.x,tower.y,angle,tower.speed, tower.damage);
                        break;
                }
            }
        }
        
        tower.time--;
        
        // remove tower if necessary
        if(tower.time<0) {
            towers.splice(i,1);
            i--;
        }
    }
    
    // spawn enemies
    if(f%60 === 0) {
        var angle = random(0,360);
        spawnEnemy(width/2 + cos(angle) * (CIRCLE_SIZE/2+5), height/2 + sin(angle) * (CIRCLE_SIZE/2+5), angle+random(-45,45), 0.1, 0.05);
    }   
    
    // spawn towers
    if(mouseIsClicked && dist(width/2,height/2,mouseX,mouseY)<CIRCLE_SIZE/2 && money - currTower.price >= 0) {
        var TOWER = currTower;
        var angle = random(0,360);
        spawnTower(mouseX, mouseY, angle, TOWER.range, TOWER.reloadInterval, TOWER.damage, TOWER.speed, TOWER.time, currKey);
        money-=TOWER.price;
    }
    
    // Game end states
    if(health<0) {
        alert("You made it to Wave " + wave + ". (but lost all health)")
        reset();
    }
    
    // mint money
    if(f%10 === 0) {
        money += 1;
    }
    
    if(f%60 === 0) {
        timer--;
        if(timer<0) {
            timer=60*60;
            wave++;
            if(wave===24) {
                alert("You made it past Wave 24.")
            }
        }
    }       
    f++;
    mouseIsClicked = false;
}

function spawnEnemy(x,y,angle,speed,damage) {
    enemies.push({
        x : x,
        y : y,
        angle : angle,
        speed : speed,
        health : 100,
        damage : damage
    });
}

function spawnTower(x,y,angle,range,reloadInterval,damage,speed,time, towerType) {
    towers.push({
        x : x,
        y : y,
        angle : angle,
        range : range,
        reloadInterval : reloadInterval,
        damage : damage,
        time : time,
        speed : speed,
        TOTAL_TIME : time,
        towerType : towerType
    });
}

function spawnBullet(x,y,angle,speed,damage) {
    bullets.push({
        x : x,
        y : y,
        angle : angle,
        speed : speed,
        damage : damage
    });
}

function reset() {
    money = 1000;
    health = 100;
    wave = 1;
    timer = 60*60;
    enemies = [];
    towers = [];
    bullets = [];
}

function mouseClicked(){
    mouseIsClicked = true;
}
