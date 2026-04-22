/**
 * Configuration for a bounded menu layout with optional scrolling.
 * Defines the panel bounds and reserved space for headers/footers.
 */
export interface MenuLayoutConfig {
  /** Left edge of the panel in screen pixels */
  panelX: number;
  /** Top edge of the panel in screen pixels */
  panelY: number;
  /** Width of the panel in pixels */
  panelWidth: number;
  /** Height of the panel in pixels */
  panelHeight: number;
  /** Height reserved for title/subtitle at the top (e.g., 120) */
  headerHeight: number;
  /** Height reserved for footer instructions at the bottom (e.g., 80) */
  footerHeight: number;
  /** Height of each menu item row in pixels */
  rowHeight: number;
}

/**
 * Calculates layout dimensions for a bounded menu.
 * Returns content area height, max visible rows, and other useful metrics.
 */
export interface MenuLayoutMetrics {
  contentAreaHeight: number;
  maxVisibleRows: number;
  contentAreaStartY: number;
  contentAreaEndY: number;
}

/**
 * Calculates menu layout metrics from a configuration.
 * Determines how many rows can fit in the content area given constraints.
 */
export function calculateMenuLayout(config: MenuLayoutConfig): MenuLayoutMetrics {
  const contentAreaHeight = config.panelHeight - config.headerHeight - config.footerHeight;
  const maxVisibleRows = Math.floor(contentAreaHeight / config.rowHeight);
  const contentAreaStartY = config.panelY + config.headerHeight;
  const contentAreaEndY = config.panelY + config.panelHeight - config.footerHeight;

  return {
    contentAreaHeight,
    maxVisibleRows,
    contentAreaStartY,
    contentAreaEndY,
  };
}

/**
 * Manages scroll offset and visible positions for menu items in a bounded region.
 * Automatically scrolls content when selection moves outside the visible area.
 * Use this to render menu items at correct Y positions accounting for scroll.
 */
export class ScrollableMenuContent {
  private config: MenuLayoutConfig;
  private metrics: MenuLayoutMetrics;
  private scrollOffset: number = 0;

  constructor(config: MenuLayoutConfig) {
    this.config = config;
    this.metrics = calculateMenuLayout(config);
  }

  /**
   * Gets the Y position for rendering a menu item at the given index.
   * Accounts for scroll offset so items outside the visible area are positioned off-screen.
   * @param index Zero-based index of the menu item
   * @returns Y position in screen pixels for rendering
   */
  getVisibleYPosition(index: number): number {
    const baseY = this.metrics.contentAreaStartY + (index * this.config.rowHeight);
    return baseY - this.scrollOffset;
  }

  /**
   * Updates scroll position when selection changes, ensuring the selected item is visible.
   * Auto-scrolls only when necessary (selection moves outside current visible area).
   * Clamps scroll so content doesn't over-scroll past bounds.
   * @param selectedIndex Zero-based index of the currently selected item
   * @param totalItems Total number of menu items
   */
  updateSelection(selectedIndex: number, totalItems: number): void {
    const maxScroll = Math.max(0, (totalItems - this.metrics.maxVisibleRows) * this.config.rowHeight);

    const itemStartY = selectedIndex * this.config.rowHeight;
    const itemEndY = itemStartY + this.config.rowHeight;

    const visibleStartY = this.scrollOffset;
    const visibleEndY = this.scrollOffset + this.metrics.contentAreaHeight;

    if (itemStartY < visibleStartY) {
      this.scrollOffset = Math.max(0, itemStartY);
    } else if (itemEndY > visibleEndY) {
      this.scrollOffset = Math.min(maxScroll, itemEndY - this.metrics.contentAreaHeight);
    }
  }

  /**
   * Gets the current scroll offset in pixels.
   * @returns Number of pixels scrolled down from the top of content
   */
  getScrollOffset(): number {
    return this.scrollOffset;
  }

  /**
   * Manually set the scroll offset.
   * Useful for resetting or jumping to a specific position.
   * @param offset Pixels to scroll (clamped to valid range)
   */
  setScrollOffset(offset: number): void {
    const maxOffset = Math.max(0, (this.getTotalScrollableHeight() - this.metrics.contentAreaHeight));
    this.scrollOffset = Math.max(0, Math.min(offset, maxOffset));
  }

  /**
   * Gets the total scrollable height (based on content).
   * Useful for clamping and bounds checking.
   */
  private getTotalScrollableHeight(): number {
    return Number.POSITIVE_INFINITY; // Determined by caller's total items
  }

  /**
   * Resets scroll offset to zero.
   * Useful when clearing or rebuilding menu.
   */
  resetScroll(): void {
    this.scrollOffset = 0;
  }

  /**
   * Gets the current layout metrics.
   */
  getMetrics(): MenuLayoutMetrics {
    return this.metrics;
  }
}
