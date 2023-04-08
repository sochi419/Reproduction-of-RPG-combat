#!/usr/bin/env node

const Enquirer = require("enquirer");

class Battle {
  startBattle() {
    this.outputStartMessage();
    new Action().selectAction();
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
  selectAction() {
    (async () => {
      for (; slime.health >= 0 && hero.health >= 0; ) {
        const answer = await Enquirer.prompt(action);

        if (answer.command == "たたかう") {
          attack.outputMessage(slime, hero);
          hero.attack(slime);
        }

        if (answer.command == "まほう") {
          const answer = await Enquirer.prompt(magic);
          if (answer.magics == "メラ") {
            hero.useMera(slime);
          }
          if (answer.magics == "バイキルト") {
            hero.useBaikiruto();
          }
          if (answer.magics == "もどる") {
            continue;
          }
        }

        if (answer.command == "どうぐ") {
          const answer = await Enquirer.prompt(belongings);
          if (answer.tools == "やくそう") {
            if (herb.remaining >= 1) {
              herb.outputMessage1();
              herb.healUser(hero);
              herb.consumeHerb(herb);
              herb.outputMessage3();
            } else {
              herb.outputMessage2();
            }
          }
          if (answer.tools == "もどる") {
            continue;
          }
        }

        if (answer.command == "にげる") {
          console.log(`にげだした!!`);
          return false;
        }

        if (slime.health <= 0) {
          console.log(`${slime.name}を倒した!`);
          return false;
        }

        slimeAction();
        new Battle().outputRemaingPower();

        if (hero.health <= 0) {
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
  }

  attack(subject) {
    subject.health = subject.health - this.attackPower;
  }

  useMera(subject) {
    if (this.magicPower >= this.magics[0].necessaryPower) {
      subject.health = subject.health - this.magics[0].damage;
      this.magicPower = this.magicPower - this.magics[0].necessaryPower;
      console.log(
        `${this.name}はメラを唱えた! ${subject.name}に${this.magics[0].damage}のダメージ!`
      );
    } else {
      console.log(`${this.name}はメラを唱えた! しかし、MPが足りなかった!`);
    }
  }

  useBaikiruto() {
    if (this.magicPower >= this.magics[1].necessaryPower) {
      this.attackPower = this.attackPower * this.magics[1].attackRate;
      this.magicPower = this.magicPower - this.magics[1].necessaryPower;
      console.log(`${this.name}はバイキルトを唱えた! 攻撃力が上がった!`);
    } else {
      console.log(
        `${this.name}はバイキルトを唱えた! しかし、MPが足りなかった!`
      );
    }
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
    if (this.magicPower >= this.magics[0].necessaryPower) {
      subject.health = subject.health - this.magics[0].damage;
      this.magicPower = this.magicPower - this.magics[0].necessaryPower;
      console.log(
        `${this.name}はメラを唱えた! ${subject.name}に${this.magics[0].damage}のダメージ!`
      );
    } else {
      console.log(`${this.name}はメラを唱えた! しかし、MPが足りなかった!`);
    }
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
}

class Baikiruto {
  constructor() {
    this.name = "バイキルト";
    this.attackRate = 1.5;
    this.necessaryPower = 10;
  }
}

class Herb {
  constructor() {
    this.name = "薬草";
    this.healingPower = 20;
    this.remaining = 2;
  }

  healUser(user) {
    user.health = user.health + this.healingPower;
  }

  consumeHerb(subject) {
    subject.remaining = subject.remaining - 1;
  }

  outputMessage1() {
    console.log(`${this.name}を使った! HPが${this.healingPower}回復した!`);
  }

  outputMessage2() {
    console.log(`${this.name}は残っていない!`);
  }

  outputMessage3() {
    console.log(`__________________________________________`);
    console.log(
      `HP:${hero.health}   |   MP:${hero.magicPower}   |    やくそう残り:${herb.remaining}`
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
