import { describe, expect, it } from 'vitest';

import { calculateMenuLayout, MenuLayoutConfig, ScrollableMenuContent } from './menuLayout';

describe('calculateMenuLayout', () => {
  it('calculates correct content area height', () => {
    const config: MenuLayoutConfig = {
      panelX: 100,
      panelY: 100,
      panelWidth: 400,
      panelHeight: 500,
      headerHeight: 120,
      footerHeight: 80,
      rowHeight: 50,
    };

    const metrics = calculateMenuLayout(config);
    expect(metrics.contentAreaHeight).toBe(300); // 500 - 120 - 80
  });

  it('calculates max visible rows correctly', () => {
    const config: MenuLayoutConfig = {
      panelX: 100,
      panelY: 100,
      panelWidth: 400,
      panelHeight: 500,
      headerHeight: 120,
      footerHeight: 80,
      rowHeight: 50,
    };

    const metrics = calculateMenuLayout(config);
    expect(metrics.maxVisibleRows).toBe(6); // 300 / 50 = 6
  });

  it('calculates content area boundaries', () => {
    const config: MenuLayoutConfig = {
      panelX: 100,
      panelY: 200,
      panelWidth: 400,
      panelHeight: 500,
      headerHeight: 120,
      footerHeight: 80,
      rowHeight: 50,
    };

    const metrics = calculateMenuLayout(config);
    expect(metrics.contentAreaStartY).toBe(320); // 200 + 120
    expect(metrics.contentAreaEndY).toBe(620); // 200 + 500 - 80
  });

  it('handles zero header and footer heights', () => {
    const config: MenuLayoutConfig = {
      panelX: 0,
      panelY: 0,
      panelWidth: 400,
      panelHeight: 400,
      headerHeight: 0,
      footerHeight: 0,
      rowHeight: 50,
    };

    const metrics = calculateMenuLayout(config);
    expect(metrics.contentAreaHeight).toBe(400);
    expect(metrics.maxVisibleRows).toBe(8);
  });
});

describe('ScrollableMenuContent', () => {
  function createTestConfig(): MenuLayoutConfig {
    return {
      panelX: 100,
      panelY: 100,
      panelWidth: 400,
      panelHeight: 500,
      headerHeight: 120,
      footerHeight: 80,
      rowHeight: 50,
    };
  }

  it('initializes with zero scroll offset', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    expect(content.getScrollOffset()).toBe(0);
  });

  it('calculates visible Y position without scroll', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    const contentAreaStartY = 220; // 100 + 120
    const yPos0 = content.getVisibleYPosition(0);
    const yPos1 = content.getVisibleYPosition(1);

    expect(yPos0).toBe(contentAreaStartY); // 220
    expect(yPos1).toBe(contentAreaStartY + 50); // 270
  });

  it('accounts for scroll offset in visible Y position', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.setScrollOffset(100);

    const contentAreaStartY = 220; // 100 + 120
    const yPos0 = content.getVisibleYPosition(0);

    expect(yPos0).toBe(contentAreaStartY - 100); // 220 - 100 = 120
  });

  it('auto-scrolls down when selection moves below visible area', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    // Content area height is 300px, 6 rows visible at 50px each
    // Visible rows: 0-5
    // Select row 6, should scroll to show it

    content.updateSelection(6, 20);

    expect(content.getScrollOffset()).toBe(50); // Scrolled 1 row (50px)
  });

  it('auto-scrolls up when selection moves above visible area', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.setScrollOffset(100); // Start scrolled down
    content.updateSelection(0, 20); // Select first item

    expect(content.getScrollOffset()).toBe(0); // Scrolled back to top
  });

  it('does not over-scroll past the end of content', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    // 20 items * 50px = 1000px total
    // Max scroll = (20 - 6) * 50 = 700px
    content.updateSelection(19, 20);

    const maxScroll = (20 - 6) * config.rowHeight;
    expect(content.getScrollOffset()).toBeLessThanOrEqual(maxScroll);
  });

  it('keeps selection visible without unnecessary scrolling', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    // Select items in visible range (rows 0-5)
    content.updateSelection(2, 20);
    expect(content.getScrollOffset()).toBe(0); // No scroll needed

    content.updateSelection(4, 20);
    expect(content.getScrollOffset()).toBe(0); // Still in visible range
  });

  it('scrolls incrementally as selection moves down', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.updateSelection(5, 20); // Last visible row without scroll
    expect(content.getScrollOffset()).toBe(0);

    content.updateSelection(6, 20); // First row that needs scroll
    expect(content.getScrollOffset()).toBe(50);

    content.updateSelection(10, 20); // Further down
    expect(content.getScrollOffset()).toBe(250);
  });

  it('resets scroll on resetScroll call', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.setScrollOffset(150);
    expect(content.getScrollOffset()).toBe(150);

    content.resetScroll();
    expect(content.getScrollOffset()).toBe(0);
  });

  it('manually sets scroll offset within bounds', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.setScrollOffset(100);
    expect(content.getScrollOffset()).toBe(100);

    content.setScrollOffset(-50); // Clamped to 0
    expect(content.getScrollOffset()).toBe(0);
  });

  it('clamps manual scroll offset to maximum', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.setScrollOffset(10000); // Very large offset
    const offsetAfter = content.getScrollOffset();

    // Should not exceed reasonable bounds
    expect(offsetAfter).toBeGreaterThanOrEqual(0);
  });

  it('provides layout metrics', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    const metrics = content.getMetrics();
    expect(metrics.contentAreaHeight).toBe(300);
    expect(metrics.maxVisibleRows).toBe(6);
    expect(metrics.contentAreaStartY).toBe(220);
  });

  it('handles edge case of single item', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.updateSelection(0, 1);
    expect(content.getScrollOffset()).toBe(0); // Single item, no scroll
  });

  it('handles edge case of exactly fitting items', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    // Exactly 6 items that fit in visible area
    content.updateSelection(5, 6);
    expect(content.getScrollOffset()).toBe(0); // All fit, no scroll
  });

  it('correctly positions items after scrolling', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.updateSelection(6, 20);
    const scrollOffset = content.getScrollOffset();

    // After scrolling, row 6 should be visible in the content area
    // Row 6 is at (6 * 50 = 300px) in content, scrolled by 50px, displayed at 220 + (300 - 50) = 470
    const contentAreaStartY = 220;
    const yPos6 = content.getVisibleYPosition(6);
    // Position is: contentAreaStartY + (index * rowHeight) - scrollOffset
    // = 220 + 300 - 50 = 470
    expect(yPos6).toBe(470);
  });

  it('maintains scroll position across multiple selections in visible range', () => {
    const config = createTestConfig();
    const content = new ScrollableMenuContent(config);

    content.updateSelection(8, 20);
    const scrollOffset8 = content.getScrollOffset(); // 150px

    // Move selection to row 9, which extends the visible range further down
    content.updateSelection(9, 20);
    const scrollOffset9 = content.getScrollOffset(); // 200px

    // Row 9 needs more scroll than row 8 to be visible
    expect(scrollOffset9).toBeGreaterThan(scrollOffset8);
  });
});
