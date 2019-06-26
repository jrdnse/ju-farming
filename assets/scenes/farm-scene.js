/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { curMoney, curLevel, school, curDay, loggedIn } from "../../main.js";
import Player from "../players/player.js";

export default class FarmScene extends Phaser.Scene {
  constructor() {
    super({
      key: "FarmScene"
    });
  }

//Preloads all of the scene's assets
  preload() {
    this.load.image("tileset", "../assets/tilesets/spritesheet.png");

    this.load.audio("bgmusic", "../assets/audio/farm.mp3");
    this.load.audio("watering", "../assets/audio/water.wav");
    this.load.audio("hoeing", "../assets/audio/hoe.wav");
    this.load.audio("planting", "../assets/audio/seeds.wav");
    this.load.audio("harvesting", "../assets/audio/scythe.wav");

    this.load.tilemapTiledJSON("map", "../assets/maps/default-map.json");
    this.load.spritesheet(
      "player",
      "../assets/players/dude-" + school + ".png",
      {
        frameWidth: 32,
        frameHeight: 48
      }
    );
    this.load.image("iconOne", "../assets/tilesets/hoeicon-07.png");
    this.load.image(
      "iconTwo",
      "../assets/tilesets/iconsfinishedall (1)-05.png"
    );
    this.load.image(
      "iconThree",
      "../assets/tilesets/iconsfinishedall (1)-06.png"
    );
    this.load.image(
      "iconFour",
      "../assets/tilesets/iconsfinishedall (1)-03.png"
    );
  }

  create() {
    let login = this.login;
    const map = this.make.tilemap({
      key: "map"
    });

    const tileset = map.addTilesetImage("spritesheet", "tileset");
    //Farming ground
    const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
    //border
    const worldLayer = map.createDynamicLayer("World", tileset, 0, 0);
    //house
    const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);

    groundLayer.setName("FarmingGround");

    //Tells Phaser to use the property "collides" from Tiled
    worldLayer.setCollisionByProperty({
      collides: true
    });
    groundLayer.setCollisionByProperty({
      collides: true
    });
    aboveLayer.setCollisionByProperty({
      collides: true
    });

    aboveLayer.setDepth(10);

    //Creates a player object and passes the parameters
    const curPlayer = (this.player = new Player(
      this,
      map,
      150,
      180,
      groundLayer
    ));

    //Adds a collider between the player body and the layers
    this.physics.add.collider(curPlayer.sprite, worldLayer);
    this.physics.add.collider(curPlayer.sprite, aboveLayer);

    //makes sure the camera follows the player
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //Puts the curLevel data, that was obtained from the database in the groundlayer
    groundLayer.putTilesAt(curLevel, 0, 0, true, this.cameras.main, 0);

    //Loads background music and plays it
    let backgMusic = this.sound.add("bgmusic", { loop: true });
    backgMusic.play();

    //Icons for the storage
    this.add
      .image(320, 583, "iconOne")
      .setScrollFactor(0)
      .setDepth(10);
    this.add
      .image(354, 585, "iconTwo")
      .setScrollFactor(0)
      .setDepth(10);
    this.add
      .image(388, 583, "iconThree")
      .setScrollFactor(0)
      .setDepth(10);
    this.add
      .image(422, 583, "iconFour")
      .setScrollFactor(0)
      .setDepth(10);

    var scoreBoard = this.add
      .rectangle(697, 40, 200, 75, 0x484848, 0.7)
      .setScrollFactor(0)
      .setStrokeStyle(6, 0x989898);

    var textMoney = this.add
      .text(610, 10, "Money " + curMoney)
      .setFontFamily("Arial")
      .setFontSize(24)
      .setColor("#ffffff")
      .setScrollFactor(0);
    this.textMoney = textMoney;

    var textDay = this.add
      .text(610, 40, "Day " + curDay)
      .setFontFamily("Arial")
      .setFontSize(24)
      .setColor("#ffffff")
      .setScrollFactor(0);
    this.textDay = textDay;

    //Initializes the following keyboard keys
    var keyObj = this.input.keyboard.addKeys("ONE, TWO, THREE, FOUR");

    //creates each individual cell for the inventory and changes the stroke depending on the active one
    var cell = this.add
      .rectangle(320, 583, 32, 32, 0x484848)
      .setScrollFactor(0)
      .setStrokeStyle(2, 0x989898);
    keyObj.ONE.on("down", function() {
      cell.setStrokeStyle(2, 0xffffff);
      cell1.setStrokeStyle(2, 0x989898);
      cell2.setStrokeStyle(2, 0x989898);
      cell3.setStrokeStyle(2, 0x989898);
    });

    var cell1 = this.add
      .rectangle(354, 583, 32, 32, 0x484848)
      .setScrollFactor(0);
    cell1.setStrokeStyle(2, 0x989898);
    keyObj.TWO.on("down", function() {
      cell.setStrokeStyle(2, 0x989898);
      cell1.setStrokeStyle(2, 0xffffff);
      cell2.setStrokeStyle(2, 0x989898);
      cell3.setStrokeStyle(2, 0x989898);
    });

    var cell2 = this.add
      .rectangle(388, 583, 32, 32, 0x484848)
      .setScrollFactor(0);
    cell2.setStrokeStyle(2, 0x989898);
    keyObj.THREE.on("down", function() {
      cell.setStrokeStyle(2, 0x989898);
      cell1.setStrokeStyle(2, 0x989898);
      cell2.setStrokeStyle(2, 0xffffff);
      cell3.setStrokeStyle(2, 0x989898);
    });

    var cell3 = this.add
      .rectangle(422, 583, 32, 32, 0x484848)
      .setScrollFactor(0);
    cell3.setStrokeStyle(2, 0x989898);
    keyObj.FOUR.on("down", function() {
      cell.setStrokeStyle(2, 0x989898);
      cell1.setStrokeStyle(2, 0x989898);
      cell2.setStrokeStyle(2, 0x989898);
      cell3.setStrokeStyle(2, 0xffffff);
    });
  }

  update() {
    //if the playes is standing by the door, start house scene
    if (
      this.player.sprite.x >= 120 &&
      this.player.sprite.x <= 160 &&
      this.player.sprite.y == 176
    ) {
      this.scene.start("HouseScene");
    }

    this.textMoney.setText("Money " + curMoney);

//Syncs the local login variable with the global one from Firebase
    this.login = loggedIn;

//If you click log out, you go back to the menu scene
    if (this.login == false) {
      this.scene.start("MenuScene");
    } else {
      this.player.update();
    }
  }
}
