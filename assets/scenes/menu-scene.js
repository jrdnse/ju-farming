/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { loggedIn } from "../../main.js";
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MenuScene"
    });
  }

  //Preloads all of the scene's assets
  preload() {
    this.load.image(
      "background",
      "../assets/menupictures/backgroundffs-01.png"
    );

    this.load.image("title", "../assets/menupictures/logo-01.png");

    this.load.image("startbutton", "../assets/menupictures/startbutton-01.png");

    this.load.image("clouds", "../assets/menupictures/clouds1-01.png");
  }

  create() {
    let login = this.login;

    this.add
      .image(0, 0, "background")
      .setOrigin(0)
      .setDepth(0); 

    let logintxt = this.add
      .text(240, 350, "")
      .setFontFamily("Arial")
      .setFontSize(32)
      .setColor("#0000000")
      .setScrollFactor(0)
      .setDepth(15);

    this.logintxt = logintxt;
    let startbutton = this.add
      .image(300, 400, "startbutton")
      .setOrigin(0)
      .setDepth(3);

    this.startbutton = startbutton;
    this.startbutton.on("pointerdown", () => {
      this.scene.start("FarmScene");
    });

    this.add
      .image(0, 0, "title")
      .setOrigin(0)
      .setDepth(3); 

    this.clouds = this.add.tileSprite(0, 0, 2000, 2000, "clouds").setOrigin(0).setScale(1); 
  }

  update() {
    this.clouds.tilePositionX += -3;
    this.login = loggedIn;

    // make sure you can only start the game if you are logged in
    if (this.login == true) {
      //sets the clickablity of the button
      this.startbutton.setInteractive(); 
      this.logintxt.setText("");
    } else if (this.login == false) {
      //disables the clickablity of the button
      this.startbutton.disableInteractive();
      this.logintxt.setText("You are not logged in!");
    }
  }
}
