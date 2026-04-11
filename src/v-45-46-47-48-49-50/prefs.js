import Adw from 'gi://Adw';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class BringoutExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        window.set_default_size(800, 700);
        window.search_enabled = true;

        let page = new Adw.PreferencesPage();
        window.add(page);

        const hideButtonsGroup = new Adw.PreferencesGroup({
            title: 'Hide the buttons as you like',
            description: `Please note that the click actions on these buttons are based on the lockdown settings.
                          /org/gnome/desktop/lockdown disable-lock-screen | disable-logout etc`,
        });

        const lockButtonRow = new Adw.SwitchRow({
            title: 'Lock Button',
            icon_name: 'system-lock-screen-symbolic',
        });
        hideButtonsGroup.add(lockButtonRow);

        const suspendButtonRow = new Adw.SwitchRow({
            title: 'Suspend Button',
            icon_name: 'media-playback-pause-symbolic',
        });
        hideButtonsGroup.add(suspendButtonRow);

        const switchUserButtonRow = new Adw.SwitchRow({
            title: 'Switch User Button',
            icon_name: 'system-switch-user-symbolic',
        });
        hideButtonsGroup.add(switchUserButtonRow);

        const logoutButtonRow = new Adw.SwitchRow({
            title: 'Logout Button',
            icon_name: 'system-log-out-symbolic',
        });
        hideButtonsGroup.add(logoutButtonRow);

        const restartButtonRow = new Adw.SwitchRow({
            title: 'Restart Button',
            icon_name: 'system-reboot-symbolic',
        });
        hideButtonsGroup.add(restartButtonRow);

        const powerButtonRow = new Adw.SwitchRow({
            title: 'Power Button',
            icon_name: 'system-shutdown-symbolic',
        });
        hideButtonsGroup.add(powerButtonRow);

        const showButtonGroup = new Adw.PreferencesGroup({
            title: 'Original Power Button',
            description: 'Turn this on if you have other extension/s that adds menu item/s to the original power button',
        });

        const originalPowerButtonRow = new Adw.SwitchRow({
            title: 'Show Original Power Button',
        });
        showButtonGroup.add(originalPowerButtonRow);

        page.add(hideButtonsGroup);
        page.add(showButtonGroup);

        window._settings.bind('hide-lock-button', lockButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-suspend-button', suspendButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-switch-user-button', switchUserButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-logout-button', logoutButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-restart-button', restartButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-power-button', powerButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('show-original-power-button', originalPowerButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    }
}
