import { HierarchyNode } from '../../domain/entities/HierarchyNode';
import { Device } from '../../domain/entities/Device';

export class VirtualDeviceBridge {
  private sampleHierarchies: Map<string, HierarchyNode> = new Map();

  constructor() {
    this.initDefaultTrees();
  }

  public getVirtualDevices(): Device[] {
    return [
      {
        id: 'virt_android_01',
        name: 'Pixel 8 Pro (Virtual Emulator)',
        platform: 'ANDROID',
        connectionType: 'VIRTUAL',
        status: 'ONLINE',
        udid: 'emulator-5554',
        resolution: '1080x2400',
        ipAddress: '127.0.0.1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'virt_ios_01',
        name: 'iPhone 15 Pro (Virtual Simulator)',
        platform: 'IOS',
        connectionType: 'VIRTUAL',
        status: 'ONLINE',
        udid: '7B0E8D91-E22A-4F93-8C61-B9DDF8437A91',
        resolution: '1179x2556',
        ipAddress: '127.0.0.1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  public getHierarchy(screenKey: string = 'LOGIN'): HierarchyNode {
    return this.sampleHierarchies.get(screenKey) || this.sampleHierarchies.get('LOGIN')!;
  }

  private initDefaultTrees() {
    const loginTree: HierarchyNode = {
      id: 'root_login',
      className: 'android.widget.FrameLayout',
      packageName: 'com.maestro.demoapp',
      bounds: { x: 0, y: 0, width: 1080, height: 2400 },
      xpath: '//hierarchy',
      clickable: false,
      longClickable: false,
      scrollable: false,
      focusable: false,
      focused: false,
      enabled: true,
      selected: false,
      visible: true,
      children: [
        {
          id: 'node_title',
          resourceId: 'com.maestro.demoapp:id/titleHeader',
          accessibilityId: 'titleHeader',
          text: 'Welcome to Maestro Flow',
          className: 'android.widget.TextView',
          bounds: { x: 100, y: 200, width: 880, height: 120 },
          xpath: '//android.widget.TextView[@resource-id="com.maestro.demoapp:id/titleHeader"]',
          clickable: false,
          longClickable: false,
          scrollable: false,
          focusable: false,
          focused: false,
          enabled: true,
          selected: false,
          visible: true,
          children: [],
        },
        {
          id: 'node_email_input',
          resourceId: 'com.maestro.demoapp:id/emailField',
          accessibilityId: 'emailField',
          contentDescription: 'Enter email address',
          text: '',
          className: 'android.widget.EditText',
          bounds: { x: 100, y: 400, width: 880, height: 140 },
          xpath: '//android.widget.EditText[@resource-id="com.maestro.demoapp:id/emailField"]',
          clickable: true,
          longClickable: false,
          scrollable: false,
          focusable: true,
          focused: true,
          enabled: true,
          selected: false,
          visible: true,
          children: [],
        },
        {
          id: 'node_password_input',
          resourceId: 'com.maestro.demoapp:id/passwordField',
          accessibilityId: 'passwordField',
          contentDescription: 'Enter password',
          text: '',
          className: 'android.widget.EditText',
          bounds: { x: 100, y: 600, width: 880, height: 140 },
          xpath: '//android.widget.EditText[@resource-id="com.maestro.demoapp:id/passwordField"]',
          clickable: true,
          longClickable: false,
          scrollable: false,
          focusable: true,
          focused: false,
          enabled: true,
          selected: false,
          visible: true,
          children: [],
        },
        {
          id: 'node_login_btn',
          resourceId: 'com.maestro.demoapp:id/loginBtn',
          accessibilityId: 'loginBtn',
          contentDescription: 'Log In Button',
          text: 'Log In',
          className: 'android.widget.Button',
          bounds: { x: 100, y: 800, width: 880, height: 150 },
          xpath: '//android.widget.Button[@resource-id="com.maestro.demoapp:id/loginBtn"]',
          clickable: true,
          longClickable: true,
          scrollable: false,
          focusable: true,
          focused: false,
          enabled: true,
          selected: false,
          visible: true,
          children: [],
        },
        {
          id: 'node_settings_link',
          accessibilityId: 'settingsLink',
          text: 'Settings',
          className: 'android.widget.TextView',
          bounds: { x: 400, y: 1100, width: 280, height: 80 },
          xpath: '//android.widget.TextView[@text="Settings"]',
          clickable: true,
          longClickable: false,
          scrollable: false,
          focusable: true,
          focused: false,
          enabled: true,
          selected: false,
          visible: true,
          children: [],
        },
      ],
    };

    this.sampleHierarchies.set('LOGIN', loginTree);
  }
}
