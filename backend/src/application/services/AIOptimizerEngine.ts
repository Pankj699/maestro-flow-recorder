import { InteractionEvent } from '../../domain/valueObjects/InteractionEvent';

export interface OptimizationSuggestion {
  type: 'REMOVE_DUPLICATE' | 'MERGE_INPUTS' | 'REPLACE_XPATH' | 'INSERT_ASSERTION' | 'SUGGEST_VARIABLE';
  title: string;
  description: string;
  originalStepIndex: number;
  replacementEvent?: InteractionEvent;
}

export class AIOptimizerEngine {
  /**
   * Optimizes an interaction flow by eliminating redundant events, merging typing steps,
   * upgrading selectors, and auto-suggesting assertions and variables.
   */
  public optimize(events: InteractionEvent[]): { optimizedEvents: InteractionEvent[]; suggestions: OptimizationSuggestion[] } {
    const suggestions: OptimizationSuggestion[] = [];
    let optimized: InteractionEvent[] = [];

    let i = 0;
    while (i < events.length) {
      const current = events[i];

      // 1. Merge consecutive INPUT_TEXT events on the same element
      if (current.type === 'INPUT_TEXT' && i + 1 < events.length) {
        const next = events[i + 1];
        if (next.type === 'INPUT_TEXT' && next.selector?.value === current.selector?.value) {
          const mergedText = (current.textValue || '') + (next.textValue || '');
          const mergedEvent: InteractionEvent = {
            ...current,
            textValue: mergedText,
          };
          suggestions.push({
            type: 'MERGE_INPUTS',
            title: 'Merged Consecutive Input Steps',
            description: `Merged typing step for selector "${current.selector?.value}" into "${mergedText}"`,
            originalStepIndex: i,
            replacementEvent: mergedEvent,
          });
          optimized.push(mergedEvent);
          i += 2;
          continue;
        }
      }

      // 2. Remove duplicate TAP events within short timeframe (< 300ms) on identical selector
      if (current.type === 'TAP' && i + 1 < events.length) {
        const next = events[i + 1];
        if (
          next.type === 'TAP' &&
          next.selector?.value === current.selector?.value &&
          next.timestamp - current.timestamp < 300
        ) {
          suggestions.push({
            type: 'REMOVE_DUPLICATE',
            title: 'Removed Duplicate Rapid Tap',
            description: `Removed accidental double-click on element "${current.selector?.value}"`,
            originalStepIndex: i + 1,
          });
          optimized.push(current);
          i += 2;
          continue;
        }
      }

      // 3. Replace brittle XPATH selectors if fallback RESOURCE_ID or ACCESSIBILITY_ID is available
      if (current.selector?.type === 'XPATH' && current.fallbackSelectors && current.fallbackSelectors.length > 0) {
        const betterSelector = current.fallbackSelectors.find(
          (s) => s.type === 'ACCESSIBILITY_ID' || s.type === 'RESOURCE_ID' || s.type === 'TEXT'
        );
        if (betterSelector) {
          const upgradedEvent: InteractionEvent = {
            ...current,
            selector: betterSelector,
          };
          suggestions.push({
            type: 'REPLACE_XPATH',
            title: 'Upgraded Selector from XPath to Stable ID',
            description: `Replaced fragile XPath "${current.selector.value}" with stable ${betterSelector.type} "${betterSelector.value}"`,
            originalStepIndex: i,
            replacementEvent: upgradedEvent,
          });
          optimized.push(upgradedEvent);
          i++;
          continue;
        }
      }

      // 4. Auto-suggest variables for email addresses or password strings
      if (current.type === 'INPUT_TEXT' && current.textValue) {
        if (current.textValue.includes('@')) {
          suggestions.push({
            type: 'SUGGEST_VARIABLE',
            title: 'Suggest Flow Variable for Email',
            description: `Detected email pattern "${current.textValue}". Recommended variable binding: \${USER_EMAIL}`,
            originalStepIndex: i,
          });
        }
      }

      optimized.push(current);
      i++;
    }

    // 5. Automatically insert assertions after key interactions (e.g. after typing or launching app)
    const finalEvents: InteractionEvent[] = [];
    for (let idx = 0; idx < optimized.length; idx++) {
      const step = optimized[idx];
      finalEvents.push(step);

      if (step.type === 'INPUT_TEXT' && step.targetNode?.text) {
        // Add assertVisible for key text
        const assertEvent: InteractionEvent = {
          id: `assert_${step.id}`,
          type: 'ASSERT_VISIBLE',
          timestamp: step.timestamp + 50,
          selector: step.selector,
        };
        suggestions.push({
          type: 'INSERT_ASSERTION',
          title: 'Auto-generated Assert Visible Step',
          description: `Added assertion after text input to guarantee input visibility`,
          originalStepIndex: idx,
        });
        finalEvents.push(assertEvent);
      }
    }

    return {
      optimizedEvents: finalEvents,
      suggestions,
    };
  }
}
