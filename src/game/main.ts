import { Game as MainGame } from './scenes/Game';
import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { PauseMenu } from './scenes/PauseMenu';
import { ShopMenu } from './scenes/ShopMenu';
import { InventoryMenu } from './scenes/InventoryMenu';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [Boot, Preloader, MainMenu, MainGame, PauseMenu, ShopMenu, InventoryMenu]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
