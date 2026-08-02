import { InteractionEvent } from '../../domain/valueObjects/InteractionEvent';

export class YAMLGenerator {
  /**
   * Converts interaction events into structured Maestro YAML code with screen box headers, section comments, and paired id+text assertions.
   */
  public generate(appId: string, events: InteractionEvent[], mainScreenTitle?: string): string {
    const yamlLines: string[] = [];

    // Header
    yamlLines.push(`appId: ${appId || 'com.example.app'}`);
    yamlLines.push('---');

    if (events.length === 0) {
      yamlLines.push('- launchApp');
      return yamlLines.join('\n');
    }

    // Screen Box Header Banner
    if (mainScreenTitle) {
      yamlLines.push('');
      yamlLines.push('# ==========================================');
      yamlLines.push(`# Verify "${mainScreenTitle}" Screen`);
      yamlLines.push('# ==========================================');
    }

    let currentSection: string | null = null;

    for (const event of events) {
      // Print Section Header comment if section changes
      if (event.selector?.sectionName && event.selector.sectionName !== currentSection) {
        currentSection = event.selector.sectionName;
        yamlLines.push('');
        yamlLines.push(currentSection);
      }

      switch (event.type) {
        case 'LAUNCH_APP':
          yamlLines.push(`- launchApp${event.appId ? `: "${event.appId}"` : ''}`);
          yamlLines.push('');
          break;

        case 'STOP_APP':
          yamlLines.push(`- stopApp${event.appId ? `: "${event.appId}"` : ''}`);
          yamlLines.push('');
          break;

        case 'TAP':
          const targetName = event.selector?.text || event.selector?.id || 'element';
          yamlLines.push(`# Tap on the selected option (${targetName})`);
          yamlLines.push(this.formatTapOn(event.selector));
          yamlLines.push('');
          break;

        case 'LONG_PRESS':
          if (event.selector) {
            yamlLines.push(this.formatLongPress(event.selector));
            yamlLines.push('');
          }
          break;

        case 'DOUBLE_TAP':
          if (event.selector) {
            yamlLines.push(this.formatDoubleTap(event.selector));
            yamlLines.push('');
          }
          break;

        case 'INPUT_TEXT':
          if (event.selector) {
            yamlLines.push(this.formatTapOn(event.selector));
          }
          yamlLines.push(`- inputText: "${this.escapeString(event.textValue || '')}"`);
          yamlLines.push('');
          break;

        case 'SWIPE':
          yamlLines.push(`- swipe:`);
          yamlLines.push(`    direction: ${event.swipeDirection || 'UP'}`);
          yamlLines.push('');
          break;

        case 'SCROLL':
          yamlLines.push(`- scroll`);
          yamlLines.push('');
          break;

        case 'SCROLL_UNTIL_VISIBLE':
          yamlLines.push(`- scrollUntilVisible:`);
          yamlLines.push(`    element:`);
          if (event.selector?.id) {
            yamlLines.push(`      id: "${this.escapeString(event.selector.id)}"`);
          } else {
            yamlLines.push(`      text: "${this.escapeString(event.selector?.text || event.selector?.value || 'Target')}"`);
          }
          yamlLines.push('');
          break;

        case 'BACK':
          yamlLines.push('- pressKey: back');
          yamlLines.push('');
          break;

        case 'HIDE_KEYBOARD':
          yamlLines.push('- hideKeyboard');
          yamlLines.push('');
          break;

        case 'OPEN_LINK':
          yamlLines.push(`- openLink: "${event.url || ''}"`);
          yamlLines.push('');
          break;

        case 'ASSERT_VISIBLE':
          yamlLines.push(this.formatAssertVisible(event.selector));
          yamlLines.push('');
          break;

        case 'EXTENDED_WAIT':
          yamlLines.push(`- extendedWaitUntil:`);
          yamlLines.push(`    visible:`);
          yamlLines.push(`      text: "${this.escapeString(event.selector?.text || event.selector?.value || 'Ready')}"`);
          yamlLines.push(`    timeout: ${event.durationMs || 5000}`);
          yamlLines.push('');
          break;
      }
    }

    return yamlLines.join('\n');
  }

  private formatTapOn(selector: any): string {
    if (!selector) return `- tapOn: "Element"`;

    if (selector.type === 'SMART_PAIR' && selector.id && selector.text) {
      return `- tapOn:\n    id: "${this.escapeString(selector.id)}"\n    text: "${this.escapeString(selector.text)}"`;
    }

    switch (selector.type) {
      case 'ACCESSIBILITY_ID':
      case 'RESOURCE_ID':
        return `- tapOn:\n    id: "${this.escapeString(selector.id || selector.value)}"`;
      case 'TEXT':
        return `- tapOn: "${this.escapeString(selector.text || selector.value)}"`;
      case 'REGEX':
        return `- tapOn:\n    text: "${this.escapeString(selector.value)}"`;
      case 'XPATH':
        return `- tapOn:\n    xpath: "${this.escapeString(selector.value)}"`;
      case 'POINT':
        return `- tapOn:\n    point: "${selector.value}"`;
      default:
        return `- tapOn: "${this.escapeString(selector.value)}"`;
    }
  }

  private formatAssertVisible(selector: any): string {
    if (!selector) return `- assertVisible: "Element"`;

    if (selector.id && selector.text) {
      return `- assertVisible:\n    id: "${this.escapeString(selector.id)}"\n    text: "${this.escapeString(selector.text)}"`;
    } else if (selector.id) {
      return `- assertVisible:\n    id: "${this.escapeString(selector.id)}"`;
    } else {
      return `- assertVisible: "${this.escapeString(selector.text || selector.value || '')}"`;
    }
  }

  private formatLongPress(selector: any): string {
    if (selector?.id) {
      return `- longPressOn:\n    id: "${this.escapeString(selector.id)}"`;
    }
    return `- longPressOn: "${this.escapeString(selector?.text || selector?.value || '')}"`;
  }

  private formatDoubleTap(selector: any): string {
    if (selector?.id) {
      return `- doubleTapOn:\n    id: "${this.escapeString(selector.id)}"`;
    }
    return `- doubleTapOn: "${this.escapeString(selector?.text || selector?.value || '')}"`;
  }

  private escapeString(str: string): string {
    return str.replace(/"/g, '\\"');
  }
}
