/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { loggedIn, updateMoney } from "../../main.js";
import { sleepMapUpdate } from "../../main.js";

export default class NightScene extends Phaser.Scene {
  constructor() {
    super({
      key: "NightScene"
    });
  }

//Preloads all of the scene's assets
preload() {
    this.load.image("nightbackground", "../assets/menupictures/nightbg-02.png");

    this.load.image("nightclouds", "../assets/menupictures/nightclouds-02.png");
  }

  create() {
    let login = this.login;

    this.add
      .image(0, 0, "nightbackground")
      .setOrigin(0)
      .setDepth(0)
      .setScale(1); 

    this.clouds = this.add
      .tileSprite(0, 0, 2000, 2000, "nightclouds")
      .setOrigin(0)
      .setScale(1);

      // Updates the map during night
    sleepMapUpdate();
    
//A 3s delayed call that starts the HouseScene
    this.timedEvent = this.time.delayedCall(
      3000,
      () => this.scene.start("HouseScene"),
      this
    );
  }

  update() {
    this.clouds.tilePositionX += -3;
    this.login = loggedIn;

    if (this.login == false) {
      this.scene.start("MenuScene");
    }
  }
}
