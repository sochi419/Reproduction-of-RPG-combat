const Enquirer = require("enquirer");

class Action {
  selectAction() {
    let hero = new Hero();
    let slime = new Slime();
    let mera = new Mera();
    let baikiruto = new Baikiruto();
    let herb = new Herb();

    console.log(`スライムが現れた!!`);
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
            `スライムに攻撃! スライムに${hero.attackPower}のダメージ!`
          );
          hero.attack(slime);
        }

        if (answer.command == "まほう") {
          const answer = await Enquirer.prompt(magic);
          if (answer.magics == "メラ") {
            if (hero.magicPower >= mera.necessaryPower) {
              console.log(`メラを唱えた! スライムに${mera.damage}のダメージ!`);
              mera.attack(slime);
              mera.consumeMagicPower(hero);
            } else {
              console.log(`メラを唱えた! しかし、MPが足りなかった!`);
            }
          }
          if (answer.magics == "バイキルト") {
            if (hero.magicPower >= baikiruto.necessaryPower) {
              console.log(`バイキルトを唱えた! 攻撃力が上がった!`);
              baikiruto.upAttackPower(hero);
              baikiruto.consumeMagicPower(hero);
            } else {
              console.log(`バイキルトを唱えた! しかし、MPが足りなかった!`);
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
              console.log(`${answer.tools}を使った! HPが20回復した!`);
              herb.healUser(hero);
              herb.consumeHerb(herb);
              console.log(`__________________________________________`);
              console.log(
                `HP:${hero.health}   |   MP:${hero.magicPower}   |    やくそう残り:${herb.remaining}`
              );
              console.log(`------------------------------------------`);
            } else {
              console.log(`やくそうは残っていない!`);
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
          console.log("スライムを倒した!");
          break;
        }

        // 敵は75%の確率で通常攻撃,25%の確率で魔法を使用する処理。
        let random = Math.floor(Math.random() * 100);
        if (random >= 25) {
          console.log(
            `スライムのこうげき! ${slime.attackPower}のダメージを受けた!`
          );
          slime.attack(hero);
        } else {
          if (slime.magicPower >= mera.necessaryPower) {
            console.log(
              `スライムはメラを唱えた! ${mera.damage}のダメージを受けた!`
            );
            mera.attack(hero);
            mera.consumeMagicPower(slime);
          } else {
            console.log(`スライムはメラを唱えた! しかし、MPが足りなかった!`);
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
}

class Herb {
  constructor() {
    this.healingPower = 20;
    this.remaining = 2;
  }

  healUser(user) {
    user.health = user.health + this.healingPower;
  }

  consumeHerb(subject) {
    subject.remaining = subject.remaining - 1;
  }
}

new Action().selectAction();
