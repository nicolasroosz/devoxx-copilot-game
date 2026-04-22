import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { SavedGameState } from '../gameState';
import { MenuOption, createHomeMenuOptions, createLoadMenuOptions, formatMenuOptionText } from '../menuModel';
import { getInitialSelectionIndex, moveSelection } from '../menuSelection';
import { getSaveSlotSummaries, loadSaveSlot } from '../saveSlots';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    optionTexts: GameObjects.Text[];
    currentView: 'home' | 'load';
    selectedIndex: number;

    constructor ()
    {
        super('MainMenu');
        this.optionTexts = [];
        this.currentView = 'home';
        this.selectedIndex = 0;
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background').setAlpha(0.45);

        this.add.rectangle(512, 384, 760, 560, 0x081525, 0.82).setStrokeStyle(4, 0x9fd8ff, 0.9);

        this.logo = this.add.image(512, 210, 'logo').setScale(0.7).setDepth(100);

        this.title = this.add.text(512, 330, 'Save Runner', {
            fontFamily: 'Arial Black', fontSize: 44, color: '#f8fbff',
            stroke: '#102030', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.subtitle = this.add.text(512, 390, 'Arrow keys to navigate, Enter to confirm, Escape to go back', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#d4e8ff',
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.registerInput();
        this.refreshMenu();

        EventBus.emit('current-scene-ready', this);
    }

    getCurrentOptions (): MenuOption[]
    {
        if (this.currentView === 'load')
        {
            return createLoadMenuOptions(getSaveSlotSummaries('load'));
        }

        return createHomeMenuOptions();
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
            const optionText = this.add.text(512, 485 + (index * 82), formatMenuOptionText(option), {
                fontFamily: 'Arial',
                fontSize: 26,
                color: '#f8fbff',
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5).setDepth(100);

            if (option.disabled)
            {
                optionText.setAlpha(0.42);
            }

            return optionText;
        });

        this.updateMenuStyles(options);
    }

    updateMenuStyles (options: MenuOption[])
    {
        this.optionTexts.forEach((optionText, index) => {
            const option = options[index];

            if (index === this.selectedIndex)
            {
                optionText.setColor(option.disabled ? '#8aa3bd' : '#ffe28a');
                optionText.setScale(1.04);
            }
            else
            {
                optionText.setColor(option.disabled ? '#8aa3bd' : '#f8fbff');
                optionText.setScale(1);
            }
        });
    }

    moveSelection (direction: 'next' | 'previous')
    {
        const options = this.getCurrentOptions();

        this.selectedIndex = moveSelection(options, this.selectedIndex, direction);
        this.updateMenuStyles(options);
    }

    startGame (saveState: SavedGameState | null = null)
    {
        this.scene.start('Game', { saveState });
    }

    handleConfirm ()
    {
        const options = this.getCurrentOptions();
        const selectedOption = options[this.selectedIndex];

        if (!selectedOption || selectedOption.disabled)
        {
            return;
        }

        if (selectedOption.action === 'start-new')
        {
            this.startGame();
            return;
        }

        if (selectedOption.action === 'open-load')
        {
            this.currentView = 'load';
            this.refreshMenu();
            return;
        }

        if (selectedOption.action === 'return-home')
        {
            this.currentView = 'home';
            this.refreshMenu();
            return;
        }

        if (selectedOption.action === 'load-slot' && selectedOption.slotId)
        {
            const saveState = loadSaveSlot(selectedOption.slotId);

            if (saveState)
        {
                this.startGame(saveState);
            }
        }
    }

    handleBack ()
    {
        if (this.currentView === 'load')
        {
            this.currentView = 'home';
            this.refreshMenu();
        }
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
