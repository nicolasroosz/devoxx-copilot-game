/**
 * Example: Using ScrollableMenuContent in a Menu Scene
 *
 * This demonstrates how to integrate the menu layout helper into a Phaser 4 menu scene.
 * The helper eliminates hardcoded Y positions and handles scroll logic automatically.
 *
 * Pattern for MainMenu, PauseMenu, ShopMenu, and InventoryMenu:
 */

import { GameObjects, Scene } from 'phaser';
import { ScrollableMenuContent, MenuLayoutConfig } from './menuLayout';

export class ExampleMenuScene extends Scene {
  private menuContent: ScrollableMenuContent;
  private optionTexts: GameObjects.Text[] = [];
  private selectedIndex: number = 0;

  constructor() {
    super('ExampleMenu');
  }

  create() {
    // 1. Define the panel bounds and reserved areas
    const config: MenuLayoutConfig = {
      panelX: 100,
      panelY: 100,
      panelWidth: 800,
      panelHeight: 600,
      headerHeight: 120, // Space for title/subtitle
      footerHeight: 80,  // Space for instructions
      rowHeight: 50,     // Height of each menu item
    };

    this.menuContent = new ScrollableMenuContent(config);

    // 2. Create your menu items (this is what your scene already does)
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

    // 3. Render items using getVisibleYPosition to account for scroll
    this.optionTexts = items.map((text, index) => {
      const yPos = this.menuContent.getVisibleYPosition(index);
      return this.add.text(512, yPos, text, {
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#ffffff',
      }).setOrigin(0.5);
    });

    this.updateMenuStyles();
  }

  moveSelection(direction: 'next' | 'previous') {
    const items = this.optionTexts.length;
    this.selectedIndex = direction === 'next'
      ? (this.selectedIndex + 1) % items
      : (this.selectedIndex - 1 + items) % items;

    // 4. Call updateSelection to auto-scroll when needed
    this.menuContent.updateSelection(this.selectedIndex, items);

    this.refreshMenuPositions();
    this.updateMenuStyles();
  }

  private refreshMenuPositions() {
    // Recalculate Y positions for all items after scroll change
    this.optionTexts.forEach((text, index) => {
      const yPos = this.menuContent.getVisibleYPosition(index);
      text.setY(yPos);
    });
  }

  private updateMenuStyles() {
    this.optionTexts.forEach((text, index) => {
      if (index === this.selectedIndex) {
        text.setColor('#ffe28a');
        text.setScale(1.1);
      } else {
        text.setColor('#ffffff');
        text.setScale(1);
      }
    });
  }
}

/**
 * Key Benefits:
 *
 * ✓ No hardcoded Y positions (e.g., "485 + (index * 82)")
 * ✓ Auto-scroll logic handles boundaries and clamping
 * ✓ Consistent between MainMenu, PauseMenu, ShopMenu, InventoryMenu
 * ✓ Easy to adjust layout: just change MenuLayoutConfig values
 * ✓ Supports large menus that exceed screen bounds
 * ✓ Scroll offset tracked separately from rendering
 *
 * Edge Cases Handled:
 * - Selection above visible area: auto-scrolls up
 * - Selection below visible area: auto-scrolls down
 * - Fewer items than max visible rows: no scroll needed
 * - Very long menus: scroll clamped to content bounds
 * - Item at boundary: positioned exactly at visible edge
 */
