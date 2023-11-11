import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

const GeneralPage = new GObject.registerClass(
    class GeneralPage extends Adw.PreferencesPage {
        constructor(settings, gettext) {
            const _ = gettext;
            super({
                title: _('Action Buttons'),
                icon_name: 'preferences-system-symbolic',
            });

            const hideButtonsGroup = new Adw.PreferencesGroup({
                title: 'Action Buttons',
            });
            this.add(hideButtonsGroup);

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
            this.add(tooltipGroup);

            const tooltipRow = new Adw.SwitchRow({
                title: 'Show Tooltip',
                subtitle: 'You can customize tooltip style using this extensions stylesheet.css file',
            });
            tooltipGroup.add(tooltipRow);

            settings.bind('hide-lock-button', lockButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            settings.bind('hide-suspend-button', suspendButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            settings.bind('hide-logout-button', logoutButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            settings.bind('hide-restart-button', restartButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            settings.bind('hide-power-button', powerButtonRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            settings.bind('show-tooltip', tooltipRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        }
    }
);

export default GeneralPage;
