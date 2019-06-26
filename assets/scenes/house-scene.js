/* eslint-disable no-undef */
import Player from "../players/player.js";
import { updateMap, curMoney, curDay, loggedIn, updateMoney } from "../../main.js";

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super({
      key: "HouseScene"
    });
  }

//Preloads all of the scene's assets
preload() {
    this.load.image("housetileset", "../assets/tilesets/hohuse.png");
    this.load.tilemapTiledJSON("house-map", "../assets/maps/houseinside.json");
    this.load.spritesheet("player", "../assets/players/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    this.sound.stopAll();
    let login = this.login;
    const map = this.make.tilemap({
      key: "house-map"
    });

    const tileset = map.addTilesetImage("hohuse", "housetileset");
    // floor
    const groundLayer = map.createStaticLayer("Ground", tileset, 0, 0);
    // walls
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    // bed
    const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);

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

    aboveLayer.setDepth(3);

    //Creates a player object and passes the parameters
    const curPlayer = this.player = new Player(this, map, 200, 200, worldLayer);
    
    //makes sure the camera follows the playe
    this.cameras.main.startFollow(this.player.sprite);

    //Adds a collider between the player body and the layers
    this.physics.add.collider(curPlayer.sprite, worldLayer);
    this.physics.add.collider(curPlayer.sprite, aboveLayer);

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

    //Syncs the local map data with the one from Firebase
    updateMap();
  }

  update() {
    // if the player is by the door start farm scene
    if (
      this.player.sprite.x >= 224 &&
      this.player.sprite.x <= 260 &&
      (this.player.sprite.y >= 270 && this.player.sprite.y <= 272)
    ) {
      this.scene.start("FarmScene");
    }

    // if the player is on the bed start sleeping scene
    if (
      this.player.sprite.x >= 80 &&
      this.player.sprite.x <= 82 &&
      (this.player.sprite.y >= 48 && this.player.sprite.y <= 80)
    ) {
      this.scene.start("NightScene");
    }

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
