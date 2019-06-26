/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import { curMoney, updateMoney } from "../../main.js";

export default class Player {
  // contructor to pass information from scenes
  constructor(scene, map, x, y, layer, tool, curPosX, curPosY, money) {
    this.scene = scene;
    this.map = map;
    this.layer = layer;
    this.tool = tool;
    this.curPosX = curPosX;
    this.curPosY = curPosY;
    this.money = money = curMoney;

    const anims = scene.anims;

    // creating animations for the player movement
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player", {
        start: 4,
        end: 4
      }),
      frameRate: 14,
      repeat: -1
    });
    anims.create({
      key: "player-left",
      frames: anims.generateFrameNumbers("player", {
        start: 0,
        end: 3
      }),
      frameRate: 12,
      repeat: -1
    });
    anims.create({
      key: "player-right",
      frames: anims.generateFrameNumbers("player", {
        start: 5,
        end: 8
      }),
      frameRate: 14,
      repeat: -1
    });
    anims.create({
      key: "player-down",
      frames: anims.generateFrameNumbers("player", {
        start: 9,
        end: 10
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "player-up",
      frames: anims.generateFrameNumbers("player", {
        start: 11,
        end: 12
      }),
      frameRate: 10,
      repeat: -1
    });

    this.sprite = scene.physics.add.sprite(x, y, "player", 0).setSize(32, 32);

// calls Phaser´s keyboard manager
    const {
      LEFT,
      RIGHT,
      UP,
      DOWN,
      SPACE,
      ONE,
      TWO,
      THREE,
      FOUR
    } = Phaser.Input.Keyboard.KeyCodes;

// sets the keys to a local variable
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      space: SPACE,
      one: ONE,
      two: TWO,
      three: THREE,
      four: FOUR
    });

    // places the square cursor 
    this.graphics = scene.add.graphics();
    this.graphics.lineStyle(2, 0x000000, 1).strokeRect(0, 0, 32, 32).setPosition(-100, -100);
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;

    var curAngle; 

    const pointerTileX = this.map.worldToTileX(sprite.x) + 1;
    const pointerTileY = this.map.worldToTileX(sprite.y) + 2;

    sprite.body.angle = curAngle;

    sprite.body.setVelocity(0);

    // changes this.tool depending on what number is pressed
    if (keys.one.isDown) {
      this.tool = 1;
    } else if (keys.two.isDown) {
      this.tool = 2;
    } else if (keys.three.isDown) {
      this.tool = 3;
    } else if (keys.four.isDown) {
      this.tool = 4;
    }

    // moves the player depending on what arrow key is pressed, plays the animation and converts the world coordinates of the world to tile coordinates so the cursor can update accordingly
    if (keys.left.isDown) {
      sprite.setVelocityX(-160);
      sprite.anims.play("player-left", true);
      curAngle = 3;
      this.curPosX = this.map.tileToWorldX(pointerTileX - 3);
      this.curPosY = this.map.tileToWorldY(pointerTileY - 2);
      this.graphics.setPosition(this.curPosX, this.curPosY);
    } else if (keys.right.isDown) {
      sprite.setVelocityX(160);
      sprite.anims.play("player-right", true);
      curAngle = 0;
      this.curPosX = this.map.tileToWorldX(pointerTileX + 1);
      this.curPosY = this.map.tileToWorldY(pointerTileY - 2);
      this.graphics.setPosition(this.curPosX, this.curPosY);
    } else if (keys.down.isDown) {
      sprite.setVelocityY(160);
      sprite.anims.play("player-down", true);
      curAngle = 1.5707963267948966;
      this.curPosX = this.map.tileToWorldX(pointerTileX - 1);
      this.curPosY = this.map.tileToWorldY(pointerTileY);
      this.graphics.setPosition(this.curPosX, this.curPosY);
    } else if (keys.up.isDown) {
      sprite.setVelocityY(-160);
      sprite.anims.play("player-up", true);
      curAngle = -1.5707963267948966;
      this.curPosX = this.map.tileToWorldX(pointerTileX - 1);
      this.curPosY = this.map.tileToWorldY(pointerTileY - 4);
      this.graphics.setPosition(this.curPosX, this.curPosY);
    } else {
      sprite.setVelocityX(0);
      sprite.anims.play("player-idle");
      curAngle = 0;
    }

// allows the player to move diagonally
    if (keys.up.isDown && keys.left.isDown) {
      sprite.setVelocityY(-160);
    } else if (keys.down.isDown && keys.left.isDown) {
      sprite.setVelocityY(160);
    } else if (keys.down.isDown && keys.right.isDown) {
      sprite.setVelocityY(160);
    } else if (keys.up.isDown && keys.right.isDown) {
      sprite.setVelocityY(-160);
    }

    sprite.body.velocity.normalize().scale(160);

    const tileCoord = this.map.worldToTileXY(this.curPosX, this.curPosY);
    const dbRef = firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/map/")
      .child(tileCoord.y)
      .child(tileCoord.x);

    const dbMoney = firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/money");

    const dbScoreboard = firebase
      .database()
      .ref("leaderboard/" + firebase.auth().currentUser.uid + "/money");

      // the logic behind the tools - replaces tilemaps and updates the database 
    if (keys.space.isDown) {
      if (this.layer.name == "FarmingGround") {
        switch (this.tool) {
          case 1:
            keys.space.isDown = false;
            console.log("hoe");
            console.log(tileCoord.y, tileCoord.x);
            if (
              tileCoord.y > 0 &&
              tileCoord.x > 0 &&
              tileCoord.y <= 30 &&
              tileCoord.x <= 30
            ) {
              this.map.putTileAtWorldXY(
                33,
                this.curPosX,
                this.curPosY,
                true,
                this.scene.cameras.main,
                0
              );
              this.scene.sound.play("hoeing");
              dbRef.set(33);
            }
            break;
          case 2:
            keys.space.isDown = false;
            console.log("watering can");
            if (
              tileCoord.y > 0 &&
              tileCoord.x > 0 &&
              tileCoord.y <= 30 &&
              tileCoord.x <= 30
            ) {
              if (
                this.layer.getTileAtWorldXY(this.curPosX, this.curPosY).index ==
                34
              ) {
                console.log(tileCoord.y, tileCoord.x);

                this.map.putTileAtWorldXY(
                  40,
                  this.curPosX,
                  this.curPosY,
                  true,
                  this.scene.cameras.main,
                  0
                );
                this.scene.sound.play("watering");
                dbRef.set(40);
              }
            }
            break;
          case 3:
            keys.space.isDown = false;
            console.log("scythe");
            console.log(tileCoord.y, tileCoord.x);
            if (
              tileCoord.y > 0 &&
              tileCoord.x > 0 &&
              tileCoord.y <= 30 &&
              tileCoord.x <= 30
            ) {
              if (
                this.layer.getTileAtWorldXY(this.curPosX, this.curPosY).index ==
                37
              ) {
                this.map.putTileAtWorldXY(
                  33,
                  this.curPosX,
                  this.curPosY,
                  true,
                  this.scene.cameras.main,
                  0
                );
                this.money += 40;
                dbMoney.set(this.money);
                dbScoreboard.set(this.money);
                updateMoney();
                console.log(this.money, curMoney);
                this.scene.sound.play("harvesting");
                dbRef.set(33);
              }
            }
            break;
          case 4:
            keys.space.isDown = false;
            console.log("seeds");
            console.log(tileCoord.y, tileCoord.x);

            if (
              tileCoord.y > 0 &&
              tileCoord.x > 0 &&
              tileCoord.y <= 30 &&
              tileCoord.x <= 30
            ) {
              if (this.money <= 0) {
                console.log("no money");
              } else {
                if (
                  this.layer.getTileAtWorldXY(this.curPosX, this.curPosY)
                    .index == 33
                ) {
                  this.map.putTileAtWorldXY(
                    34,
                    this.curPosX,
                    this.curPosY,
                    true,
                    this.scene.cameras.main,
                    0
                  );
                  this.money -= 20;
                  dbMoney.set(this.money);
                  dbScoreboard.set(this.money);
                  updateMoney();
                  console.log(this.money, curMoney);
                  this.scene.sound.play("planting");
                  dbRef.set(34);
                }
              }
            }
        }
      }
    }
  }
}
