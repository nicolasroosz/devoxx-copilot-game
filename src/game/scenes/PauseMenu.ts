import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { GameRunState, createSavedGameState } from '../gameState';
import { MenuOption, createPauseMenuOptions, createSaveMenuOptions, formatMenuOptionText } from '../menuModel';
import { getInitialSelectionIndex, moveSelection } from '../menuSelection';
import { getSaveSlotSummaries, saveToSlot } from '../saveSlots';
import { ScrollableMenuContent, MenuLayoutConfig } from '../menuLayout';

interface PauseMenuData
{
    runState: GameRunState;
}

export class PauseMenu extends Scene
{
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    optionTexts: GameObjects.Text[];
    currentView: 'root' | 'save';
    selectedIndex: number;
    currentRunState: GameRunState;
    scrollableContent: ScrollableMenuContent;

    constructor ()
    {
        super('PauseMenu');
        this.optionTexts = [];
        this.currentView = 'root';
        this.selectedIndex = 0;
        this.currentRunState = {
            playerX: 0,
            stepCount: 0,
            lastStepIndex: 0,
            ownedItemIds: []
        };
        this.scrollableContent = null!;
    }

    init (data: PauseMenuData)
    {
        this.currentRunState = data.runState;
        this.currentView = 'root';
        this.selectedIndex = 0;
    }

    create ()
    {
        this.add.rectangle(512, 384, 1024, 768, 0x02060c, 0.72);
        this.add.rectangle(512, 384, 720, 500, 0x11243b, 0.96).setStrokeStyle(4, 0xf6d27a, 0.9);

        this.title = this.add.text(512, 220, 'Paused', {
            fontFamily: 'Arial Black',
            fontSize: 40,
            color: '#f8fbff',
            stroke: '#09131f',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.subtitle = this.add.text(512, 282, 'Arrow keys to navigate, Enter to confirm, Escape to resume', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#d4e8ff',
            align: 'center'
        }).setOrigin(0.5);

        const layoutConfig: MenuLayoutConfig = {
            panelX: 512,
            panelY: 134,
            panelWidth: 720,
            panelHeight: 500,
            headerHeight: 180,
            footerHeight: 80,
            rowHeight: 78
        };
        this.scrollableContent = new ScrollableMenuContent(layoutConfig);

        this.registerInput();
        this.refreshMenu();

        EventBus.emit('current-scene-ready', this);
    }

    getCurrentOptions (): MenuOption[]
    {
        if (this.currentView === 'save')
        {
            return createSaveMenuOptions(getSaveSlotSummaries('save'));
        }

        return createPauseMenuOptions();
    }

    refreshMenu (preferredIndex = 0)
    {
        const options = this.getCurrentOptions();

        this.selectedIndex = getInitialSelectionIndex(options, preferredIndex);

        for (const optionText of this.optionTexts)
        {
            optionText.destroy();
        }

        this.optionTexts = options.map((option, index) => {
            const yPos = this.scrollableContent.getVisibleYPosition(index);
            return this.add.text(512, yPos, formatMenuOptionText(option), {
                fontFamily: 'Arial',
                fontSize: 25,
                color: '#f8fbff',
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5);
        });

        this.updateMenuStyles(options);
    }

    updateMenuStyles (options: MenuOption[])
    {
        this.optionTexts.forEach((optionText, index) => {
            if (index === this.selectedIndex)
            {
                optionText.setColor('#ffe28a');
                optionText.setScale(1.04);
            }
            else
            {
                optionText.setColor('#f8fbff');
                optionText.setScale(1);
            }

            if (options[index].disabled)
            {
                optionText.setAlpha(0.42);
            }
            else
            {
                optionText.setAlpha(1);
            }
        });
    }

    moveSelection (direction: 'next' | 'previous')
    {
        const options = this.getCurrentOptions();

        this.selectedIndex = moveSelection(options, this.selectedIndex, direction);
        this.scrollableContent.updateSelection(this.selectedIndex, options.length);
        this.updateMenuStyles(options);
    }

    resumeGame ()
    {
        const gameScene = this.scene.get('Game');

        this.scene.resume('Game');
        EventBus.emit('current-scene-ready', gameScene);
        this.scene.stop();
    }

    handleConfirm ()
    {
        const options = this.getCurrentOptions();
        const selectedOption = options[this.selectedIndex];

        if (!selectedOption || selectedOption.disabled)
        {
            return;
        }

        if (selectedOption.action === 'resume')
        {
            this.resumeGame();
            return;
        }

        if (selectedOption.action === 'open-save')
        {
            this.currentView = 'save';
            this.refreshMenu();
            return;
        }

        if (selectedOption.action === 'return-pause')
        {
            this.currentView = 'root';
            this.refreshMenu();
            return;
        }

        if (selectedOption.action === 'save-slot' && selectedOption.slotId)
        {
            saveToSlot(selectedOption.slotId, createSavedGameState(this.currentRunState, new Date().toISOString()));
            this.resumeGame();
            return;
        }

        if (selectedOption.action === 'exit-run')
        {
            this.scene.stop('Game');
            this.scene.start('MainMenu');
        }
    }

    handleBack ()
    {
        if (this.currentView === 'save')
        {
            this.currentView = 'root';
            this.refreshMenu();
            return;
        }

        this.resumeGame();
    }

    registerInput ()
    {
        this.input.keyboard?.on('keydown-UP', () => this.moveSelection('previous'));
        this.input.keyboard?.on('keydown-LEFT', () => this.moveSelection('previous'));
        this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection('next'));
        this.input.keyboard?.on('keydown-RIGHT', () => this.moveSelection('next'));
        this.input.keyboard?.on('keydown-ENTER', () => this.handleConfirm());
        this.input.keyboard?.on('keydown-ESC', () => this.handleBack());
    }
}