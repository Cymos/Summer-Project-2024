const player = {
    level: 1,
    maxHealth: 100, // use to reset health after a defeat
    health: 100,
    strength: 20,
    armor: 15,
    gold: 0,
    experience: 0,
    experienceToNextLevel: 100 // initial xp for level 2
};

// enemy data for different enemies
const enemies = {
    enemy1: { name: "Enemy 1", maxHealth: 80, health: 80, strength: 15, armor: 10, goldReward: 50, experienceReward: 100 },
    enemy2: { name: "Enemy 2", maxHealth: 100, health: 100, strength: 20, armor: 15, goldReward: 75, experienceReward: 150 },
    enemy3: { name: "Enemy 3", maxHealth: 120, health: 120, strength: 25, armor: 20, goldReward: 100, experienceReward: 200 }
};

// Enemy stats (current enemy)
let enemy = { ...enemies.enemy1 }; // start with first enemy as default

// elements to update UI
const playerLevelElement = document.getElementById('player-level');
const playerHealthElement = document.getElementById('player-health');
const playerStrengthElement = document.getElementById('player-strength');
const playerArmorElement = document.getElementById('player-armor');
const playerGoldElement = document.getElementById('player-gold');
const playerExperienceElement = document.getElementById('player-experience');
const enemyHealthElement = document.getElementById('enemy-health');
const enemyStrengthElement = document.getElementById('enemy-strength');
const enemyArmorElement = document.getElementById('enemy-armor');
const fightResultElement = document.getElementById('fight-result');
const enemySelectElement = document.getElementById('enemy-select');

// function to reset after a defeat
function resetAfterDefeat() {
    player.health = player.maxHealth;
    enemy.health = enemy.maxHealth;
}

// function to spawn a new enemy based on the current selection
function spawnNewEnemy() {
    const selectedEnemyKey = enemySelectElement.value;
    enemy = { ...enemies[selectedEnemyKey] }; // clone the selected enemies stats

    // update enemy stats in UI
    document.getElementById('enemy-health').textContent = enemy.maxHealt;
    document.getElementById('enemy-strength').textContent = enemy.strength;
    document.getElementById('enemy-armor').textContent = enemy.armor;

    updateStats();
}

// update initial stats on the UI
function updateStats() {
    playerLevelElement.textContent = player.level;
    playerHealthElement.textContent = player.health;
    playerStrengthElement.textContent = player.strength;
    playerArmorElement.textContent = player.armor;
    playerGoldElement.textContent = player.gold;
    playerExperienceElement.textContent = `${player.experience} / ${player.experienceToNextLevel}`;
    enemyHealthElement.textContent = enemy.health;
    enemyStrengthElement.textContent = enemy.strength;
    enemyArmorElement.textContent = enemy.armor;
}

// function to handle leveling up
function levelUp() {
    player.level++;
    player.maxHealth += 20; // increase hp
    player.strength += 5; // increase atk
    player.armor += 5; // increase def
    player.experienceToNextLevel += 100; // increase the experience required for the next level

    fightResultElement.textContent += `Level Up! You are now level ${player.level}.`;
}

// function to check if the player can level up?
function checkLevelUp() {
    if (player.experience >= player.experienceToNextLevel) {
        player.experience -= player.experienceToNextLevel; // this carries excess xp over to the new level
        levelUp();
    }
}

// function to log messages in the fight log
function logFight(turn, playerDamage, enemyDamage) {
    const logList = document.getElementById('log-list');
    const logEntry = document.createElement('li');
    logEntry.textContent = `Turn ${turn}: You hit for ${playerDamage} damage, enemy hit for ${enemyDamage}.`;
    logList.appendChild(logEntry);
}

function fight() {
    const fightButton = document.getElementById('fight-button');
    fightButton.disabled = true; // disables the fight button immediately

    let countdown = 2; // countdown duration in seconds
    fightButton.textContent = `Fighting... (${countdown})`; // initial text with countdown

    // timer function to update the countdown
    const timer = setInterval(() => {
        countdown--;
        fightButton.textContent = `Fighting... (${countdown})`;

        if (countdown <= 0) {
            clearInterval(timer); // stop the timer
            fightButton.disabled = false; // re-enable the button
            fightButton.textContent = 'Fight';
        }
    }, 1000); // update every second

    let turn = 0;
    let fightOver = false;

    // reset fight log
    document.getElementById('log-list').innerHTML = '';

    while (!fightOver) {
        turn++;
        // calc player dmg to enemy
    const playerDamage = Math.max(player.strength - enemy.armor, 0);
    enemy.health -= playerDamage;

    // calc enemy dmg to player
    const enemyDamage = Math.max(enemy.strength - player.armor, 0);
    player.health -= enemyDamage;

    // log the results of this turn
    logFight(turn, playerDamage, enemyDamage);

    // check the outcome of the fight
    if (player.health > 0 && enemy.health <= 0) {
        // player wins
        player.gold += enemy.goldReward;
        player.experience += enemy.experienceReward;
        fightResultElement.textContent = `You won! Gained ${enemy.goldReward} gold and ${enemy.experienceReward}xp. `;
        checkLevelUp(); // checks if ready to level up
        spawnNewEnemy(); // spawn new enemy with same stats
        fightOver = true;
    } else if (player.health <= 0 && enemy.health > 0) {
        // enemy wins
        fightResultElement.textContent = `You lost! The enemy defeated you.`;
        resetAfterDefeat();
        fightOver = true;
    } else if (player.health <= 0 && enemy.health <= 0) {
        // both defeated
        fightResultElement.textContent = `It's a tie! Both you and the enemy have been defeated.`;
        resetAfterDefeat();
        fightOver = true;
    } else {
        // continue fight
        continue; // loop to the next turn
    }

    // always update UI after processes
    updateStats();
    }
}

// don't forget to add event listener to buttons!
document.getElementById('fight-button').addEventListener('click', fight);
enemySelectElement.addEventListener('change', spawnNewEnemy);

// initialise the game
updateStats();
spawnNewEnemy();