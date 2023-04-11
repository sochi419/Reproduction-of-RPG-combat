#!/usr/bin/env node

const Enquirer = require("enquirer");

class Battle {
  startBattle() {
    this.outputStartMessage();
    new Action(hero, slime).selectAction();
  }

  outputStartMessage() {
    console.log(`${slime.name}が現れた!!`);
    console.log(`_____________________`);
    console.log(`HP:${hero.health}   |   MP:${hero.magicPower}`);
    console.log(`---------------------`);
  }

  outputRemaingPower() {
    console.log(`_____________________`);
    console.log(`HP:${hero.health}   |   MP:${hero.magicPower}`);
    console.log(`---------------------`);
  }
}

class Action {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
  }
  selectAction() {
    (async () => {
      for (; this.enemy.health >= 0 && this.player.health >= 0; ) {
        const answer = await Enquirer.prompt(action);

        if (answer.command === "たたかう") {
          attack.outputMessage(this.enemy, this.player);
          this.player.attack(this.enemy);
        }

        if (answer.command === "まほう") {
          const answer = await Enquirer.prompt(magic);
          if (answer.magics == "メラ") {
            this.player.useMera(this.enemy);
          }
          if (answer.magics === "バイキルト") {
            this.player.useBaikiruto();
          }
          if (answer.magics === "もどる") {
            continue;
          }
        }

        if (answer.command === "どうぐ") {
          const answer = await Enquirer.prompt(belongings);
          if (answer.tools === "やくそう") {
            herb.healUser(this.player);
          }
          if (answer.tools === "もどる") {
            continue;
          }
        }

        if (answer.command === "にげる") {
          console.log(`にげだした!!`);
          return false;
        }

        if (this.enemy.health <= 0) {
          console.log(`${this.enemy.name}を倒した!`);
          return false;
        }

        slimeAction();
        new Battle().outputRemaingPower();

        if (this.player.health <= 0) {
          console.log("ゲームオーバー!");
          return false;
        }
      }
    })();
  }
}

class Hero {
  constructor() {
    this.name = "勇者";
    this.health = 50;
    this.attackPower = 5;
    this.magicPower = 10;
    this.magics = [new Mera(), new Baikiruto()];
    this.herbRemaining = 2;
  }

  attack(subject) {
    subject.health = subject.health - this.attackPower;
  }

  useMera(subject) {
    this.magics[0].use(hero, subject);
  }

  useBaikiruto() {
    this.magics[1].use(hero);
  }
}

class Slime {
  constructor() {
    this.name = "スライム";
    this.health = 70;
    this.attackPower = 5;
    this.magicPower = 10;
    this.magics = [new Mera()];
  }

  attack(subject) {
    subject.health = subject.health - this.attackPower;
  }

  useMera(subject) {
    this.magics[0].use(slime, subject);
  }
}

class Attack {
  outputMessage(user1, user2) {
    console.log(
      `${user2.name}は${user1.name}に攻撃! ${user1.name}に${user2.attackPower}のダメージ!`
    );
  }
}

class Mera {
  constructor() {
    this.name = "メラ";
    this.damage = 20;
    this.necessaryPower = 5;
  }

  use(user, subject) {
    if (user.magicPower >= this.necessaryPower) {
      subject.health = subject.health - this.damage;
      user.magicPower = user.magicPower - this.necessaryPower;
      console.log(
        `${user.name}はメラを唱えた! ${subject.name}に${this.damage}のダメージ!`
      );
    } else {
      console.log(`${user.name}はメラを唱えた! しかし、MPが足りなかった!`);
    }
  }
}

class Baikiruto {
  constructor() {
    this.name = "バイキルト";
    this.attackRate = 1.5;
    this.necessaryPower = 10;
  }

  use(user) {
    if (user.magicPower >= this.necessaryPower) {
      user.attackPower = user.attackPower * this.attackRate;
      user.magicPower = user.magicPower - this.necessaryPower;
      console.log(`${user.name}はバイキルトを唱えた! 攻撃力が上がった!`);
    } else {
      console.log(
        `${user.name}はバイキルトを唱えた! しかし、MPが足りなかった!`
      );
    }
  }
}

class Herb {
  constructor() {
    this.name = "薬草";
    this.healingPower = 20;
  }

  healUser(user) {
    if (user.herbRemaining > 0) {
      user.health = user.health + this.healingPower;
      user.herbRemaining = user.herbRemaining - 1;
      console.log(`${this.name}を使った! HPが${this.healingPower}回復した!`);
    } else {
      console.log(`${this.name}は残っていない!`);
    }
    console.log(`__________________________________________`);
    console.log(
      `HP:${user.health}   |   MP:${user.magicPower}   |    やくそう残り:${user.herbRemaining}`
    );
    console.log(`------------------------------------------`);
  }
}

const hero = new Hero();
const slime = new Slime();
const attack = new Attack();
const herb = new Herb();

const action = {
  type: "select",
  name: "command",
  message: "どうする？",
  choices: ["たたかう", "まほう", "どうぐ", "にげる"],
};

const magicCommand = hero.magics.map(function (obj) {
  return obj.name;
});
magicCommand.push("もどる");

const magic = {
  type: "select",
  name: "magics",
  message: "どの魔法を使う?",
  choices: magicCommand,
};

const belongings = {
  type: "select",
  name: "tools",
  message: "使う道具は?",
  choices: ["やくそう", "もどる"],
};

function slimeAction() {
  // 敵は75%の確率で通常攻撃,25%の確率でメラを使用する処理。
  let random = Math.floor(Math.random() * 100);
  if (random >= 25) {
    attack.outputMessage(hero, slime);
    slime.attack(hero);
  } else {
    slime.useMera(hero);
  }
}

new Battle().startBattle();
