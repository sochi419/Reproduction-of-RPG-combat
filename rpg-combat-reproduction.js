#!/usr/bin/env node

const Enquirer = require("enquirer");

class Action {
  selectAction() {
    let hero = new Hero();
    let slime = new Slime();
    let mera = new Mera();
    let baikiruto = new Baikiruto();
    let herb = new Herb();

    console.log(`${slime.name}が現れた!!`);
    console.log(`_____________________`);
    console.log(`HP:${hero.health}   |   MP:${hero.magicPower}`);
    console.log(`---------------------`);

    (async () => {
      const action = {
        type: "select",
        name: "command",
        message: "どうする？",
        choices: ["たたかう", "まほう", "どうぐ", "にげる"],
      };

      const magic = {
        type: "select",
        name: "magics",
        message: "どの魔法を使う?",
        choices: ["メラ", "バイキルト", "もどる"],
      };

      const belongings = {
        type: "select",
        name: "tools",
        message: "使う道具は?",
        choices: ["やくそう", "もどる"],
      };

      for (; slime.health >= 0 && hero.health >= 0; ) {
        const answer = await Enquirer.prompt(action);

        if (answer.command == "たたかう") {
          console.log(
            `${slime.name}に攻撃! ${slime.name}に${hero.attackPower}のダメージ!`
          );
          hero.attack(slime);
        }

        if (answer.command == "まほう") {
          const answer = await Enquirer.prompt(magic);
          if (answer.magics == "メラ") {
            if (hero.magicPower >= mera.necessaryPower) {
              mera.outputMessage1(hero, slime);
              mera.attack(slime);
              mera.consumeMagicPower(hero);
            } else {
              mera.outputMessage2(hero);
            }
          }
          if (answer.magics == "バイキルト") {
            if (hero.magicPower >= baikiruto.necessaryPower) {
              baikiruto.outputMessage1(hero);
              baikiruto.upAttackPower(hero);
              baikiruto.consumeMagicPower(hero);
            } else {
              baikiruto.outputMessage2(hero);
            }
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
              console.log(`__________________________________________`);
              console.log(
                `HP:${hero.health}   |   MP:${hero.magicPower}   |    やくそう残り:${herb.remaining}`
              );
              console.log(`------------------------------------------`);
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
          break;
        }

        if (slime.health <= 0) {
          console.log(`${slime.name}を倒した!`);
          break;
        }

        // 敵は75%の確率で通常攻撃,25%の確率で魔法を使用する処理。
        let random = Math.floor(Math.random() * 100);
        if (random >= 25) {
          console.log(
            `${slime.name}のこうげき! ${slime.attackPower}のダメージを受けた!`
          );
          slime.attack(hero);
        } else {
          if (slime.magicPower >= mera.necessaryPower) {
            mera.outputMessage1(slime, hero);
            mera.attack(hero);
            mera.consumeMagicPower(slime);
          } else {
            mera.outputMessage2(slime);
          }
        }

        console.log(`_____________________`);
        console.log(`HP:${hero.health}   |   MP:${hero.magicPower}`);
        console.log(`---------------------`);

        if (hero.health <= 0) {
          console.log("ゲームオーバー!");
          break;
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
  }

  attack(subject) {
    subject.health = subject.health - this.attackPower;
  }
}

class Slime {
  constructor() {
    this.name = "スライム";
    this.health = 70;
    this.attackPower = 5;
    this.magicPower = 10;
  }

  attack(subject) {
    subject.health = subject.health - this.attackPower;
  }
}

class Mera {
  constructor() {
    this.damage = 20;
    this.necessaryPower = 5;
  }
  attack(subject) {
    subject.health = subject.health - this.damage;
  }
  consumeMagicPower(user) {
    user.magicPower = user.magicPower - this.necessaryPower;
  }
  outputMessage1(user1, user2) {
    console.log(
      `${user1.name}はメラを唱えた! ${user2.name}に${this.damage}のダメージ!`
    );
  }
  outputMessage2(user) {
    console.log(`${user.name}はメラを唱えた! しかし、MPが足りなかった!`);
  }
}

class Baikiruto {
  constructor() {
    this.attackRate = 1.5;
    this.necessaryPower = 10;
  }

  upAttackPower(user) {
    user.attackPower = user.attackPower * this.attackRate;
  }

  consumeMagicPower(user) {
    user.magicPower = user.magicPower - this.necessaryPower;
  }

  outputMessage1(user) {
    console.log(`${user.name}はバイキルトを唱えた! 攻撃力が上がった!`);
  }

  outputMessage2(user) {
    console.log(`${user.name}はバイキルトを唱えた! しかし、MPが足りなかった!`);
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
    console.log(`${this.name}を使った! HPが20回復した!`);
  }

  outputMessage2() {
    console.log(`${this.name}は残っていない!`);
  }
}

new Action().selectAction();
