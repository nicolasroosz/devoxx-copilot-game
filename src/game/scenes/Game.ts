import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { PlayerMovementInput, resolvePlayerMotion } from '../playerMovement';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Phaser.GameObjects.Image;
    statusText: Phaser.GameObjects.Text;
    instructionsText: Phaser.GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    playerSpeed: number;

    constructor ()
    {
        super('Game');
        this.playerSpeed = 260;
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');
        this.load.image('player', 'player.svg');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x122238);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.35);
        this.background.setDisplaySize(this.scale.width, this.scale.height);

        this.player = this.add.image(this.scale.width / 2, this.scale.height - 140, 'player');
        this.player.setDisplaySize(88, 88);

        this.statusText = this.add.text(32, 28, 'State: idle', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#f8fbff',
            stroke: '#102030',
            strokeThickness: 6
        });

        this.instructionsText = this.add.text(32, 70, 'Use the left and right arrow keys to move.', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#d7e7ff'
        });

        this.cursors = this.input.keyboard?.createCursorKeys();

        EventBus.emit('current-scene-ready', this);
    }

    update (_time: number, delta: number)
    {
        const movementInput: PlayerMovementInput = {
            leftPressed: this.cursors?.left?.isDown ?? false,
            rightPressed: this.cursors?.right?.isDown ?? false,
            speed: this.playerSpeed,
            deltaMs: delta,
            minX: 56,
            maxX: this.scale.width - 56
        };

        const motion = resolvePlayerMotion(this.player.x, movementInput);

        this.player.setX(motion.x);
        this.player.setFlipX(motion.facing === 'left');
        this.player.setTint(motion.isMoving ? 0xffffff : 0xbad5ff);
        this.statusText.setText(`State: ${motion.isMoving ? `moving ${motion.facing}` : 'idle'}`);
    }

    changeScene ()
    {
        this.scene.restart();
    }
}
