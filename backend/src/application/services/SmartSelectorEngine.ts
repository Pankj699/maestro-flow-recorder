import { HierarchyNode } from '../../domain/entities/HierarchyNode';
import { Selector, SmartSelectorResult } from '../../domain/valueObjects/Selector';

export class SmartSelectorEngine {
  public generateSelectors(node: HierarchyNode): SmartSelectorResult {
    const selectors: Selector[] = [];

    const rawId = node.accessibilityId || node.resourceId;
    const cleanId = rawId ? (rawId.includes(':id/') ? rawId.split(':id/')[1] : rawId) : null;
    const cleanText = node.text?.trim() || node.contentDescription?.trim();

    if (cleanId && cleanText) {
      selectors.push({
        type: 'SMART_PAIR',
        value: `${cleanId} ("${cleanText}")`,
        id: cleanId,
        text: cleanText,
        score: 110,
        description: 'Smart Paired ID + Text',
      });
    }

    if (cleanText) {
      selectors.push({
        type: 'TEXT',
        value: cleanText,
        text: cleanText,
        score: 100,
        description: 'Visible Text',
      });
    }

    if (cleanId) {
      selectors.push({
        type: 'RESOURCE_ID',
        value: cleanId,
        id: cleanId,
        score: 90,
        description: 'Resource ID',
      });
    }

    if (cleanText && cleanText.length > 5 && /\d+/.test(cleanText)) {
      const regexPattern = cleanText.replace(/\d+/g, '.*');
      selectors.push({
        type: 'REGEX',
        value: `^${regexPattern}$`,
        score: 70,
        description: 'Dynamic Regex Pattern',
      });
    }

    if (node.xpath && node.xpath.trim().length > 0) {
      selectors.push({
        type: 'XPATH',
        value: node.xpath,
        score: 50,
        description: 'Structural XPath',
      });
    }

    const centerX = Math.round(node.bounds.x + node.bounds.width / 2);
    const centerY = Math.round(node.bounds.y + node.bounds.height / 2);

    selectors.push({
      type: 'POINT',
      value: `${centerX}, ${centerY}`,
      point: { x: centerX, y: centerY },
      score: 10,
      description: 'Center Screen Point (Coordinates Fallback)',
    });

    selectors.sort((a, b) => b.score - a.score);

    return {
      primarySelector: selectors[0],
      fallbackSelectors: selectors.slice(1),
      confidence: selectors[0].score / 100,
    };
  }

  /**
   * Scrapes entire screen UI tree, detects main Screen Title, and categorizes visible elements into
   * structured sections (# Verify Title Section, # Verify User Options, # Verify Selection Indicator, # Verify Navigation Buttons).
   */
  public autoScrapeScreenElements(tree: HierarchyNode): { mainScreenTitle: string; selectors: Selector[] } {
    const scrapedSelectors: Selector[] = [];
    const seenValues = new Set<string>();
    let mainScreenTitle = 'Mobile View';

    // First pass to detect main Screen Title (heading ending with ? or first prominent top text)
    const findTitle = (node: HierarchyNode) => {
      if (node.visible && node.text && node.text.trim().length > 3) {
        const text = node.text.trim();
        if (text.includes('?') || node.bounds.y < 450) {
          if (mainScreenTitle === 'Mobile View') {
            mainScreenTitle = text;
          }
        }
      }
      if (node.children) {
        for (const child of node.children) findTitle(child);
      }
    };
    findTitle(tree);

    // Second pass: Categorize all visible elements into sections
    const traverse = (node: HierarchyNode) => {
      if (node.visible) {
        const rawId = node.accessibilityId || node.resourceId;
        const cleanId = rawId ? (rawId.includes(':id/') ? rawId.split(':id/')[1] : rawId) : null;
        const cleanText = node.text?.trim() || node.contentDescription?.trim();

        let sectionName = '# Verify Content Section';

        // Smart Section Categorization
        if (node.bounds.y < 500 || (cleanText && (cleanText.includes('?') || cleanText.toLowerCase().includes('welcome') || cleanText.toLowerCase().includes('this helps us')))) {
          sectionName = '# Verify Title Section';
        } else if (cleanText && (cleanText.toLowerCase().includes('next') || cleanText.toLowerCase().includes('skip') || cleanText.toLowerCase().includes('continue') || cleanText.toLowerCase().includes('back') || cleanText.toLowerCase().includes('submit'))) {
          sectionName = '# Verify Navigation Buttons';
        } else if (cleanId && (cleanId.toLowerCase().includes('select') || cleanId.toLowerCase().includes('check') || cleanId.toLowerCase().includes('radio') || cleanId.toLowerCase().includes('imgselect'))) {
          sectionName = '# Verify Selection Indicator';
        } else if (cleanText || (cleanId && (cleanId.toLowerCase().includes('option') || cleanId.toLowerCase().includes('item') || cleanId.toLowerCase().includes('card')))) {
          sectionName = '# Verify User Options';
        }

        if (cleanId && cleanText) {
          const key = `${cleanId}_${cleanText}`;
          if (!seenValues.has(key)) {
            seenValues.add(key);
            scrapedSelectors.push({
              type: 'SMART_PAIR',
              value: `${cleanId} ("${cleanText}")`,
              id: cleanId,
              text: cleanText,
              sectionName,
              score: 110,
              description: `Paired ID + Text: ${cleanId}`,
            });
          }
        } else if (cleanText) {
          if (!seenValues.has(cleanText)) {
            seenValues.add(cleanText);
            scrapedSelectors.push({
              type: 'TEXT',
              value: cleanText,
              text: cleanText,
              sectionName,
              score: 100,
              description: `Visible Text: "${cleanText}"`,
            });
          }
        } else if (cleanId && (node.className.includes('Image') || node.className.includes('Button') || node.className.includes('View'))) {
          if (!seenValues.has(cleanId)) {
            seenValues.add(cleanId);
            scrapedSelectors.push({
              type: 'RESOURCE_ID',
              value: cleanId,
              id: cleanId,
              sectionName,
              score: 85,
              description: `Component ID: ${cleanId}`,
            });
          }
        }
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    traverse(tree);
    return { mainScreenTitle, selectors: scrapedSelectors };
  }

  public findBestMatchingNode(tree: HierarchyNode, targetX: number, targetY: number): HierarchyNode | null {
    let bestNode: HierarchyNode | null = null;
    let minArea = Infinity;

    const traverse = (node: HierarchyNode) => {
      const { x, y, width, height } = node.bounds;
      const insideX = targetX >= x && targetX <= x + width;
      const insideY = targetY >= y && targetY <= y + height;

      if (insideX && insideY) {
        const area = width * height;
        if (area < minArea && (node.clickable || node.focusable || node.text || node.resourceId || node.accessibilityId)) {
          minArea = area;
          bestNode = node;
        }
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    traverse(tree);
    return bestNode;
  }
}
