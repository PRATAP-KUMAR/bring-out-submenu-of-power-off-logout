import Adw from 'gi://Adw';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup();
        page.add(group);

        const lockButtonRow = new Adw.SwitchRow({
            title: 'Remove Lock Button',
        });
        group.add(lockButtonRow);

        const suspendButtonRow = new Adw.SwitchRow({
            title: 'Remove Suspend Button',
        });
        group.add(suspendButtonRow);

        const logoutButtonRow = new Adw.SwitchRow({
            title: 'Remove Logout Button',
        });
        group.add(logoutButtonRow);

        const restartButtonRow = new Adw.SwitchRow({
            title: 'Remove Restart Button',
        });
        group.add(restartButtonRow);

        const powerButtonRow = new Adw.SwitchRow({
            title: 'Remove Power Button',
        });
        group.add(powerButtonRow);

        window._settings = this.getSettings();
        window._settings.bind('remove-lock-button', lockButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-suspend-button', suspendButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-logout-button', logoutButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-restart-button', restartButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-power-button', powerButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    }
}
