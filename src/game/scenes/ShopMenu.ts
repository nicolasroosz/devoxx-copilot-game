import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameRunState } from '../gameState';
import { Category } from '../catalog';
import { getAvailableItems, purchaseItem } from '../purchase';
import { ScrollableMenuContent, MenuLayoutConfig } from '../menuLayout';

interface ShopMenuData {
  runState: GameRunState;
}

export class ShopMenu extends Scene {
  currentRunState: GameRunState;
  categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];
  selectedCategoryIndex: number = 0;
  selectedItemIndex: number = 0;
  
  categoryTitleText: GameObjects.Text | null = null;
  leftArrowText: GameObjects.Text | null = null;
  rightArrowText: GameObjects.Text | null = null;
  itemTexts: GameObjects.Text[] = [];
  priceText: GameObjects.Text | null = null;
  affordabilityText: GameObjects.Text | null = null;
  placeholderRect: GameObjects.Rectangle | null = null;
  feedbackText: GameObjects.Text | null = null;
  footerText: GameObjects.Text | null = null;
  scrollableContent: ScrollableMenuContent;

  constructor() {
    super('ShopMenu');
    this.currentRunState = {
      playerX: 0,
      stepCount: 0,
      lastStepIndex: 0,
      ownedItemIds: []
    };
    this.scrollableContent = null!;
  }

  init(data: ShopMenuData) {
    this.currentRunState = data.runState;
    this.selectedCategoryIndex = 0;
    this.selectedItemIndex = 0;
  }

  create() {
    this.add.rectangle(512, 384, 1024, 768, 0x02060c, 0.72);
    this.add.rectangle(512, 384, 720, 500, 0x1a3a4a, 0.96)
      .setStrokeStyle(4, 0x4a9fba, 0.9);

    this.categoryTitleText = this.add.text(512, 220, '', {
      fontFamily: 'Arial Black',
      fontSize: 40,
      color: '#4adfba',
      stroke: '#09131f',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.leftArrowText = this.add.text(380, 220, '◄', {
      fontFamily: 'Arial Black',
      fontSize: 40,
      color: '#4adfba',
      stroke: '#09131f',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.rightArrowText = this.add.text(644, 220, '►', {
      fontFamily: 'Arial Black',
      fontSize: 40,
      color: '#4adfba',
      stroke: '#09131f',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.footerText = this.add.text(512, 700, 'Left/Right: tabs | Up/Down: browse | Enter: buy | S/Esc: close', {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#a0d0d8',
      align: 'center'
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(512, 300, '', {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#ffaaaa'
    }).setOrigin(0.5);

    const layoutConfig: MenuLayoutConfig = {
      panelX: 512,
      panelY: 134,
      panelWidth: 720,
      panelHeight: 500,
      headerHeight: 150,
      footerHeight: 80,
      rowHeight: 40
    };
    this.scrollableContent = new ScrollableMenuContent(layoutConfig);

    this.registerInput();
    this.refreshShop();
    
    EventBus.emit('current-scene-ready', this);
  }

  getAvailableItemsInCurrentCategory() {
    const category = this.categories[this.selectedCategoryIndex];
    return getAvailableItems(category, this.currentRunState);
  }

  refreshShop() {
    const items = this.getAvailableItemsInCurrentCategory();
    const category = this.categories[this.selectedCategoryIndex];

    this.categoryTitleText?.setText(category.charAt(0).toUpperCase() + category.slice(1));

    this.leftArrowText?.setText('◄');
    this.rightArrowText?.setText('►');

    for (const text of this.itemTexts) {
      text.destroy();
    }
    this.itemTexts = [];

    if (items.length === 0) {
      this.add.text(512, 380, 'No items available in this category', {
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#8890aa'
      }).setOrigin(0.5);
      this.selectedItemIndex = 0;
    } else {
      items.forEach((item, index) => {
        const yPos = this.scrollableContent.getVisibleYPosition(index);
        const text = this.add.text(280, yPos, item.name, {
          fontFamily: 'Arial',
          fontSize: 18,
          color: '#f8fbff'
        }).setOrigin(0, 0.5);
        this.itemTexts.push(text);
      });

      if (this.selectedItemIndex >= items.length) {
        this.selectedItemIndex = Math.max(0, items.length - 1);
      }
    }

    this.scrollableContent.resetScroll();
    this.updateItemStyles();
    this.updateItemDetails();
  }

  updateItemStyles() {
    this.itemTexts.forEach((text, index) => {
      if (index === this.selectedItemIndex) {
        text.setColor('#ffe28a');
        text.setScale(1.05);
      } else {
        text.setColor('#f8fbff');
        text.setScale(1);
      }
    });
  }

  private refreshItemPositions() {
    this.itemTexts.forEach((text, index) => {
      const yPos = this.scrollableContent.getVisibleYPosition(index);
      text.setY(yPos);
    });
  }

  updateItemDetails() {
    const items = this.getAvailableItemsInCurrentCategory();

    if (this.priceText) {
      this.priceText.destroy();
      this.priceText = null;
    }
    if (this.affordabilityText) {
      this.affordabilityText.destroy();
      this.affordabilityText = null;
    }
    if (this.placeholderRect) {
      this.placeholderRect.destroy();
      this.placeholderRect = null;
    }

    if (items.length === 0) {
      return;
    }

    const selectedItem = items[this.selectedItemIndex];
    if (!selectedItem) {
      return;
    }

    const canAfford = this.currentRunState.stepCount >= selectedItem.price;
    const affordabilityColor = canAfford ? '#4aff99' : '#aa8888';

    this.priceText = this.add.text(650, 380, `${selectedItem.price} steps`, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#f8fbff'
    }).setOrigin(0, 0.5);

    this.affordabilityText = this.add.text(650, 420, canAfford ? 'Affordable' : 'Cannot afford', {
      fontFamily: 'Arial',
      fontSize: 18,
      color: affordabilityColor
    }).setOrigin(0, 0.5);

    const categoryColorMap: { [key in Category]?: number } = {
      'shoes': 0xff6b9d,
      'hat': 0xffc75f,
      't-shirt': 0x5dade2,
      'pants': 0x52be80
    };

    const color = categoryColorMap[this.categories[this.selectedCategoryIndex] as Category] || 0x888888;

    this.placeholderRect = this.add.rectangle(750, 500, 80, 80, color, 0.6)
      .setStrokeStyle(3, 0xffffff, 0.8);
  }

  moveTab(direction: 'left' | 'right') {
    if (direction === 'left') {
      this.selectedCategoryIndex = (this.selectedCategoryIndex - 1 + this.categories.length) % this.categories.length;
    } else {
      this.selectedCategoryIndex = (this.selectedCategoryIndex + 1) % this.categories.length;
    }
    this.selectedItemIndex = 0;
    this.feedbackText!.setText('');
    this.refreshShop();
  }

  moveItem(direction: 'up' | 'down') {
    const items = this.getAvailableItemsInCurrentCategory();
    if (items.length === 0) {
      return;
    }

    if (direction === 'up') {
      this.selectedItemIndex = (this.selectedItemIndex - 1 + items.length) % items.length;
    } else {
      this.selectedItemIndex = (this.selectedItemIndex + 1) % items.length;
    }

    this.scrollableContent.updateSelection(this.selectedItemIndex, items.length);
    this.refreshItemPositions();
    this.updateItemStyles();
    this.updateItemDetails();
  }

  attemptPurchase() {
    const items = this.getAvailableItemsInCurrentCategory();
    if (items.length === 0 || this.selectedItemIndex >= items.length) {
      return;
    }

    const selectedItem = items[this.selectedItemIndex];
    const result = purchaseItem(this.currentRunState, selectedItem);

    if (result.success && result.newRunState) {
      this.currentRunState = result.newRunState;
      this.feedbackText!.setText(`Bought ${selectedItem.name}!`).setColor('#4aff99');

      this.time.delayedCall(800, () => {
        this.feedbackText!.setText('');
        this.refreshShop();
      });
    } else {
      this.feedbackText!.setText(result.message).setColor('#ffaaaa');

      this.time.delayedCall(1200, () => {
        this.feedbackText!.setText('');
      });
    }
  }

  closeShop() {
    const gameScene = this.scene.get('Game') as any;
    if (gameScene && gameScene.updateRunState) {
      gameScene.updateRunState(this.currentRunState);
    }
    if (gameScene && gameScene.closeShop) {
      gameScene.closeShop();
    }
    this.scene.stop();
  }

  registerInput() {
    this.input.keyboard?.on('keydown-LEFT', () => this.moveTab('left'));
    this.input.keyboard?.on('keydown-RIGHT', () => this.moveTab('right'));
    this.input.keyboard?.on('keydown-UP', () => this.moveItem('up'));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveItem('down'));
    this.input.keyboard?.on('keydown-ENTER', () => this.attemptPurchase());
    this.input.keyboard?.on('keydown-S', () => this.closeShop());
    this.input.keyboard?.on('keydown-ESC', () => this.closeShop());
  }
}
