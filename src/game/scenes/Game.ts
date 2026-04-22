import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';
import { GameRunState, SavedGameState, hydrateRunState } from '../gameState';
import { PlayerMovementInput, resolvePlayerMotion } from '../playerMovement';

const WORLD_WIDTH = 4096;
const WORLD_HEIGHT = 768;
const FLOOR_HEIGHT = 112;
const FLOOR_TOP = WORLD_HEIGHT - FLOOR_HEIGHT;
const PLAYER_WIDTH = 88;
const PLAYER_HEIGHT = 88;
const PLAYER_START_X = 512;
const PLAYER_SPEED = 260;
const STEP_DISTANCE = 48;
const MIN_PLAYER_X = 56;
const MAX_PLAYER_X = WORLD_WIDTH - 56;

interface GameSceneData
{
    saveState?: SavedGameState | null;
}

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: GameObjects.TileSprite;
    ground: GameObjects.TileSprite;
    player: GameObjects.Image;
    stepCounterText: GameObjects.Text;
    helperText: GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    playerSpeed: number;
    stepCount: number;
    lastStepIndex: number;
    ownedItemIds: string[];
    saveState: SavedGameState | null;
    shopActive: boolean;
    inventoryActive: boolean;

    constructor ()
    {
        super('Game');
        this.playerSpeed = PLAYER_SPEED;
        this.stepCount = 0;
        this.lastStepIndex = 0;
        this.ownedItemIds = [];
        this.saveState = null;
        this.shopActive = false;
        this.inventoryActive = false;
    }

    init (data: GameSceneData)
    {
        this.saveState = data.saveState ?? null;
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('player', 'player.svg');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.camera.setBackgroundColor(0x8fd7ff);

        this.createProceduralTextures();

        this.background = this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 'sky');
        this.background.setDepth(0);
        this.background.setScrollFactor(0.2);

        this.add.rectangle(WORLD_WIDTH / 2, FLOOR_TOP - 6, WORLD_WIDTH, 12, 0x4e351f).setOrigin(0.5, 0.5).setDepth(4);
        this.ground = this.add.tileSprite(WORLD_WIDTH / 2, FLOOR_TOP + FLOOR_HEIGHT / 2, WORLD_WIDTH, FLOOR_HEIGHT, 'dirt');
        this.ground.setDepth(5);

        const runState = hydrateRunState(this.saveState, {
            defaultPlayerX: PLAYER_START_X,
            minPlayerX: MIN_PLAYER_X,
            maxPlayerX: MAX_PLAYER_X,
            stepDistance: STEP_DISTANCE
        });

        this.player = this.add.image(runState.playerX, FLOOR_TOP - PLAYER_HEIGHT / 2, 'player');
        this.player.setDisplaySize(PLAYER_WIDTH, PLAYER_HEIGHT);
        this.player.setDepth(20);

        this.stepCount = runState.stepCount;
        this.lastStepIndex = runState.lastStepIndex;
        this.ownedItemIds = runState.ownedItemIds;

        this.stepCounterText = this.add.text(this.scale.width - 24, 24, `Steps: ${this.stepCount}`, {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#f8fbff',
            stroke: '#102030',
            strokeThickness: 6
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000);

        this.helperText = this.add.text(24, 24, 'Left/Right: move\nS: shop | I: inventory | Esc: pause', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#d7e7ff',
            stroke: '#102030',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(1000);

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.input.keyboard?.on('keydown-ESC', () => this.openPauseMenu());
        this.input.keyboard?.on('keydown-S', () => this.openShop());
        this.input.keyboard?.on('keydown-I', () => this.openInventory());

        EventBus.emit('current-scene-ready', this);
    }

    update (_time: number, delta: number)
    {
        if (this.shopActive || this.inventoryActive)
        {
            return;
        }

        const movementInput: PlayerMovementInput = {
            leftPressed: this.cursors?.left?.isDown ?? false,
            rightPressed: this.cursors?.right?.isDown ?? false,
            speed: this.playerSpeed,
            deltaMs: delta,
            minX: MIN_PLAYER_X,
            maxX: MAX_PLAYER_X
        };

        const motion = resolvePlayerMotion(this.player.x, movementInput);

        this.player.setX(motion.x);
        this.player.setFlipX(motion.facing === 'left');
        this.player.setTint(motion.isMoving ? 0xffffff : 0xbad5ff);

        const currentStepIndex = this.getStepIndex(motion.x);

        if (currentStepIndex !== this.lastStepIndex)
        {
            this.stepCount += Math.abs(currentStepIndex - this.lastStepIndex);
            this.lastStepIndex = currentStepIndex;
            this.stepCounterText.setText(`Steps: ${this.stepCount}`);
        }
    }

    getRunState (): GameRunState
    {
        return {
            playerX: this.player.x,
            stepCount: this.stepCount,
            lastStepIndex: this.lastStepIndex,
            ownedItemIds: this.ownedItemIds
        };
    }

    updateRunState (newRunState: GameRunState): void
    {
        this.stepCount = newRunState.stepCount;
        this.ownedItemIds = newRunState.ownedItemIds;
        this.stepCounterText.setText(`Steps: ${this.stepCount}`);
    }

    openPauseMenu ()
    {
        if (this.scene.isActive('PauseMenu'))
        {
            return;
        }

        this.scene.launch('PauseMenu', { runState: this.getRunState() });
        this.scene.pause();
    }

    openShop ()
    {
        if (this.scene.isActive('ShopMenu') || this.scene.isPaused())
        {
            return;
        }

        this.shopActive = true;
        this.scene.launch('ShopMenu', { runState: this.getRunState() });
    }

    closeShop ()
    {
        this.shopActive = false;
    }

    openInventory ()
    {
        if (this.scene.isActive('InventoryMenu') || this.scene.isPaused())
        {
            return;
        }

        this.inventoryActive = true;
        this.scene.launch('InventoryMenu', { runState: this.getRunState() });
    }

    closeInventory ()
    {
        this.inventoryActive = false;
    }

    changeScene ()
    {
        this.scene.restart();
    }

    createProceduralTextures ()
    {
        if (!this.textures.exists('sky'))
        {
            const sky = this.add.graphics();

            sky.fillStyle(0x8fd7ff, 1);
            sky.fillRect(0, 0, 1024, 768);

            sky.fillStyle(0xcff1ff, 0.75);
            sky.fillRect(0, 0, 1024, 220);

            sky.fillStyle(0xffe08a, 1);
            sky.fillCircle(870, 120, 54);

            sky.fillStyle(0xffffff, 0.9);
            sky.fillCircle(180, 150, 34);
            sky.fillCircle(220, 140, 42);
            sky.fillCircle(265, 154, 30);
            sky.fillCircle(650, 175, 28);
            sky.fillCircle(690, 160, 40);
            sky.fillCircle(735, 176, 32);
            sky.fillCircle(280, 280, 24);
            sky.fillCircle(320, 268, 34);
            sky.fillCircle(360, 282, 26);

            sky.fillStyle(0x6ea6d6, 0.22);
            sky.fillRect(0, 520, 1024, 248);

            sky.generateTexture('sky', 1024, 768);
            sky.destroy();
        }

        if (!this.textures.exists('dirt'))
        {
            const dirt = this.add.graphics();

            dirt.fillStyle(0x7a4a22, 1);
            dirt.fillRect(0, 0, 128, 128);

            dirt.fillStyle(0x8b5a2b, 1);
            dirt.fillRect(0, 0, 128, 24);

            dirt.fillStyle(0x68411f, 1);
            dirt.fillCircle(18, 48, 5);
            dirt.fillCircle(38, 76, 6);
            dirt.fillCircle(72, 34, 4);
            dirt.fillCircle(96, 58, 5);
            dirt.fillCircle(108, 96, 4);
            dirt.fillCircle(54, 104, 6);

            dirt.fillStyle(0x9f6a37, 0.8);
            dirt.fillRect(0, 10, 128, 4);
            dirt.fillRect(0, 28, 128, 3);
            dirt.fillRect(0, 68, 128, 3);

            dirt.generateTexture('dirt', 128, 128);
            dirt.destroy();
        }
    }

    getStepIndex (x: number)
    {
        return Math.floor(x / STEP_DISTANCE);
    }
}
