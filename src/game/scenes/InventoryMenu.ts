import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { GameRunState } from '../gameState';
import { Category } from '../catalog';
import { getMostExpensiveOwnedItem } from '../purchase';
import { ScrollableMenuContent, MenuLayoutConfig } from '../menuLayout';

interface InventoryMenuData
{
    runState: GameRunState;
}

interface InventorySlot
{
    category: Category;
    itemName: string;
    itemPrice: number | null;
    isOwned: boolean;
}

const CATEGORIES: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];
const CATEGORY_COLORS: Record<Category, number> = {
    'shoes': 0xff6b6b,
    'hat': 0x4ecdc4,
    't-shirt': 0xffe66d,
    'pants': 0x95e1d3
};

export class InventoryMenu extends Scene
{
    slots: InventorySlot[];
    slotTexts: GameObjects.Text[];
    selectedIndex: number;
    currentRunState: GameRunState;
    scrollableContent: ScrollableMenuContent;

    constructor ()
    {
        super('InventoryMenu');
        this.slots = [];
        this.slotTexts = [];
        this.selectedIndex = 0;
        this.currentRunState = {
            playerX: 0,
            stepCount: 0,
            lastStepIndex: 0,
            ownedItemIds: []
        };
        this.scrollableContent = null!;
    }

    init (data: InventoryMenuData)
    {
        this.currentRunState = data.runState;
        this.selectedIndex = 0;
    }

    create ()
    {
        this.add.rectangle(512, 384, 1024, 768, 0x02060c, 0.72);
        this.add.rectangle(512, 384, 720, 500, 0x11243b, 0.96).setStrokeStyle(4, 0xf6d27a, 0.9);

        this.add.text(512, 220, 'Inventory', {
            fontFamily: 'Arial Black',
            fontSize: 40,
            color: '#f8fbff',
            stroke: '#09131f',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(512, 550, 'Arrow keys to navigate, Escape to close', {
            fontFamily: 'Arial',
            fontSize: 14,
            color: '#d4e8ff',
            align: 'center'
        }).setOrigin(0.5);

        const layoutConfig: MenuLayoutConfig = {
            panelX: 512,
            panelY: 134,
            panelWidth: 720,
            panelHeight: 500,
            headerHeight: 100,
            footerHeight: 80,
            rowHeight: 100
        };
        this.scrollableContent = new ScrollableMenuContent(layoutConfig);

        this.buildSlots();
        this.renderSlots();
        this.registerInput();

        EventBus.emit('current-scene-ready', this);
    }

    buildSlots ()
    {
        this.slots = CATEGORIES.map((category) => {
            const ownedItem = getMostExpensiveOwnedItem(category, this.currentRunState);

            return {
                category,
                itemName: ownedItem?.name ?? 'Empty',
                itemPrice: ownedItem?.price ?? null,
                isOwned: ownedItem !== null
            };
        });
    }

    renderSlots ()
    {
        for (const text of this.slotTexts)
        {
            text.destroy();
        }
        this.slotTexts = [];

        this.slots.forEach((slot, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const x = 300 + col * 400;
            const y = 310 + row * 100;

            const color = CATEGORY_COLORS[slot.category];
            this.add.rectangle(x, y, 160, 80, color, 0.2).setStrokeStyle(2, color, 0.8);

            const categoryText = this.add.text(x, y - 25, slot.category.toUpperCase(), {
                fontFamily: 'Arial',
                fontSize: 12,
                color: '#f8fbff',
                align: 'center'
            }).setOrigin(0.5);

            const itemText = this.add.text(x, y, slot.itemName, {
                fontFamily: 'Arial',
                fontSize: 16,
                color: '#ffe28a',
                align: 'center'
            }).setOrigin(0.5);

            const priceText = slot.itemPrice !== null
                ? this.add.text(x, y + 25, `${slot.itemPrice} steps`, {
                    fontFamily: 'Arial',
                    fontSize: 12,
                    color: '#d4e8ff',
                    align: 'center'
                }).setOrigin(0.5)
                : this.add.text(x, y + 25, '', {
                    fontFamily: 'Arial',
                    fontSize: 12,
                    color: '#d4e8ff',
                    align: 'center'
                }).setOrigin(0.5);

            if (index === this.selectedIndex)
            {
                categoryText.setScale(1.1);
                itemText.setScale(1.1);
                this.add.rectangle(x, y, 160, 80).setStrokeStyle(3, 0xffff00, 1);
            }

            this.slotTexts.push(categoryText, itemText, priceText);
        });
    }

    moveSelection (direction: 'up' | 'down' | 'left' | 'right')
    {
        const nextIndex = this.getNextIndex(direction);
        this.selectedIndex = nextIndex;
        this.renderSlots();
    }

    getNextIndex (direction: 'up' | 'down' | 'left' | 'right'): number
    {
        const currentRow = Math.floor(this.selectedIndex / 2);
        const currentCol = this.selectedIndex % 2;

        let nextRow = currentRow;
        let nextCol = currentCol;

        if (direction === 'up')
        {
            nextRow = currentRow === 0 ? 1 : currentRow - 1;
        }
        else if (direction === 'down')
        {
            nextRow = currentRow === 1 ? 0 : currentRow + 1;
        }
        else if (direction === 'left')
        {
            nextCol = currentCol === 0 ? 1 : currentCol - 1;
        }
        else if (direction === 'right')
        {
            nextCol = currentCol === 1 ? 0 : currentCol + 1;
        }

        return nextRow * 2 + nextCol;
    }

    closeInventory ()
    {
        const gameScene = this.scene.get('Game') as any;
        if (gameScene && gameScene.closeInventory)
        {
            gameScene.closeInventory();
        }
        this.scene.stop();
        const game = this.scene.get('Game');
        EventBus.emit('current-scene-ready', game);
    }

    registerInput ()
    {
        this.input.keyboard?.on('keydown-UP', () => this.moveSelection('up'));
        this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection('down'));
        this.input.keyboard?.on('keydown-LEFT', () => this.moveSelection('left'));
        this.input.keyboard?.on('keydown-RIGHT', () => this.moveSelection('right'));
        this.input.keyboard?.on('keydown-ESC', () => this.closeInventory());
    }
}
