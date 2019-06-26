import MenuScene from "../assets/scenes/menu-scene.js";
import FarmScene from "../assets/scenes/farm-scene.js";
import HouseScene from "../assets/scenes/house-scene.js";
import NightScene from "../assets/scenes/night-scene.js";

export default {
    // eslint-disable-next-line no-undef
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    pixelArt: true,
    backgroundColor: "#1d212d",
    scene: [MenuScene, FarmScene, HouseScene, NightScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            }
        }
    }
}