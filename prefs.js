import Adw from 'gi://Adw';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class BringoutExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        window.add(page);

        const hideButtonsGroup = new Adw.PreferencesGroup({
            title: 'Action Buttons',
        });
        page.add(hideButtonsGroup);

        const lockButtonRow = new Adw.SwitchRow({
            title: 'Hide Lock Button',
        });
        hideButtonsGroup.add(lockButtonRow);

        const suspendButtonRow = new Adw.SwitchRow({
            title: 'Hide Suspend Button',
        });
        hideButtonsGroup.add(suspendButtonRow);

        const logoutButtonRow = new Adw.SwitchRow({
            title: 'Hide Logout Button',
        });
        hideButtonsGroup.add(logoutButtonRow);

        const restartButtonRow = new Adw.SwitchRow({
            title: 'Hide Restart Button',
        });
        hideButtonsGroup.add(restartButtonRow);

        const powerButtonRow = new Adw.SwitchRow({
            title: 'Hide Power Button',
        });
        hideButtonsGroup.add(powerButtonRow);

        const tooltipGroup = new Adw.PreferencesGroup({
            title: 'Tooltip',
        });
        page.add(tooltipGroup);

        const tooltipRow = new Adw.SwitchRow({
            title: 'Show Tooltip',
            subtitle: 'You can customize tooltip style using this extensions stylesheet.css file',
        });
        tooltipGroup.add(tooltipRow);

        window._settings = this.getSettings();
        window._settings.bind('hide-lock-button', lockButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-suspend-button', suspendButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-logout-button', logoutButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-restart-button', restartButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('hide-power-button', powerButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('show-tooltip', tooltipRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    }
}
