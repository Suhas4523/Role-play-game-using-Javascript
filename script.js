let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ['stick'];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const monsterStats = document.querySelector('#monsterStats');
const monsterNameText = document.querySelector('#monsterName');
const monsterHealthText = document.querySelector('#monsterHealth');
const weapons = [
  {
    name : 'stick',
    power : 5
  },
{
  name : 'dagger',
  power : 30
},
{
  name : 'claw hammer',
  power : 50
},
{
  name : 'sword',
  power : 100
}
];

const monsters = [
  {
    name : "slime",
    level : 2,
    health : 15
  },
    {
      name : "fanged beast",
      level : 8,
      health : 60
    },
  {
    name : "dragon",
    level : 20,
    health : 300
  }
]
const locations = [
  {
    name : "town square",
    'button text' : ['Go to Store','Go to cave','Fight Dragon'],  
    'button functions' : [goStore,goCave,fightDragon],
    text : 'You are in the town square. You see a sign that says \'store\'.'
  },
  {
    name : "store",
    'button text' : ['buy 10 health(10 gold)','buy weapon(30 gold)','Go to town square'],  
    'button functions' : [buyHealth,buyWeapon,goTown],
    text : 'You have entered the store.'
  },
  {
    name : 'cave',
    'button text' : ['fight slime','fight fanged beast','go to town square'],
    'button functions' : [fightSlime,fightBeast,goTown],
    text : "you have entered the cave. you see some monsters."
  },
  {
    name : 'fight',
    'button text' : ['Attack',"Dodge",'Run'],
    'button functions' : [attack,dodge,goTown],
    text : "you are fighting a monster"
  },
  {
    name : 'kill monster',
    'button text' : ['Go to town square','Go to town square','Go To Town Square'], 
    'button functions' : [goTown,goTown,easterEgg],
    text : 'The monster screams \'Arg!\' as it dies. You gain experience points and find gold.'
  },
  {
    name : 'lose',
    'button text' : ['REPLAY?','REPLAY?','REPLAY?'], 
    'button functions' : [restart,restart,restart],
    text : 'You died'
  },
  {
    name : 'win',
    'button text' : ['REPLAY?','REPLAY?','REPLAY?'], 
    'button functions' : [restart,restart,restart],
    text : 'You defeated the dragon! You win the Game!'
  },
  {
    name : 'easter egg',
    'button text' : ['2','8','Go to town square?'], 
    'button functions' : [pickTwo,pickEight,goTown],
    text : 'You find secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you chose matches one of the random numbers, you win!'
  }
];

//comment
/*this is a comment */
//initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location){
   monsterStats.style.display = "none";
   button1.innerText = location['button text'][0];
   button2.innerText = location['button text'][1];
   button3.innerText = location['button text'][2];
   button1.onclick = location['button functions'][0];
   button2.onclick = location['button functions'][1];
   button3.onclick = location['button functions'][2];
   text.innerText = location.text; // or we can use location['text'];
}
function goTown() {
   update(locations[0]);
}

function goStore() {
   update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if(gold >= 10) {
    gold = gold - 10; // gold -= 10;
    health = health + 10; //health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    }
  else {
    text.innerText = 'you do not have enough gold to buy health.';
  }
}

function buyWeapon() {
  if(currentWeapon < weapons.length - 1) {
     if(gold>=30){
       gold -= 30;
       currentWeapon++;
       goldText.innerText = gold;
       let newWeapon = weapons[currentWeapon].name;
       text.innerText  = 'you now have a ' + newWeapon + '.';   
       inventory.push(newWeapon);
       text.innerText += 'in your inventory you have :' + inventory;
  } else {
      text.innerText = 'you do not have enough gold to buy a weapon.';
    }
  } else {
      text.innerText = 'you already have the most powerful weapon';
      button2.innerText = 'sell weapon for 15 gold'
      button2.onclick = sellWeapon;
  }
}

function sellWeapon()
{
  if(inventory.length > 1){
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift()
    text.innerText = 'you sold a ' + currentWeapon + " .\n";
    text.innerText += 'in your inventory you have : ' + inventory;
  }
  else{
    text.innerText = "don't sell your only weapon";
  }
}

function fightSlime() {
    fighting = 0
    goFight();
}

function fightBeast() {
    fighting = 1
    goFight();
}

function fightDragon() {
    fighting = 2 
    goFight();
}

function goFight() {
    update(locations[3])
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = 'block';
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}


function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks. ";
    text.innerText += "You attack it with your " + weapons[currentWeapon].name +" ."
  
    if(isMonsterHit()) {
      health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
      text.innerText += "You missed. ";
    }
    
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
   if(health<=0){
     lose();
   }
  else if (monsterHealth <= 0){
    if(fighting === 2){
      winGame();
    } else {
      defeatMonster();
    }   //fighting === 2 ? winGame() : defeatMonster();
 }

  if(Math.random() <= .1 && inventory.length !== 1){
    text.innerText += '  Your  '   + inventory.pop()+   "  breaks.  ";
    currentWeapon--;
  }
}

function dodge() {
    text.innerText = 'You have dodged the attack from the ' + monsters[fighting].name + " ."
}


function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit
}

function isMonsterHit(){
    return Math.random() > .2 || health < 20;
}

function defeatMonster(){
  gold += Math.floor(monsters[fighting].level + 6.7)
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4])
}

function lose()
{
   update(locations[5])
}

function winGame(){
  update(locations[6])
}

function restart(){
  let xp = 0;
  let health = 100;
  let gold = 50;
  let inventory = ['stick'];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg(){
      update(locations[7])
}

function pickTwo(){
     pick(2)
}

function pickEight(){
     pick(8)
}

function pick(guess){
  let numbers = []
  while(numbers.length < 10)
    {
      numbers.push(Math.floor(Math.random() * 11));
    }

  text.innerText = "You have Picked " + guess + " . Here are the random numbers:\n";

  for(let i=0;i<10;i++){
    text.innerText += numbers[i] + "\n" ;
  }

  if(numbers.indexOf(guess) !== -1){
    text.innerText += "Right! you win 20 gold"
    gold += 20;
    goldText.innerText = gold;
  }
  else{
    text.innerText += "Wrong! you lose 10 health"
    health -= 10;
    healthText.innerText = health;
    if(health<=0){
      lose();
    }
  }
}


