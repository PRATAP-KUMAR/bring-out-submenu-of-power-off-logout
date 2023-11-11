import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

const HibernationPage = new GObject.registerClass(
    class HibernationPage extends Adw.PreferencesPage {
        constructor(settings, gettext) {
            const _ = gettext;
            super({
                title: _('Hibernation Settings'),
                icon_name: 'preferences-system-symbolic',
            });

            const infoGroup = new Adw.PreferencesGroup({
                title: _('Important Info'),
            });
            this.add(infoGroup);

            const banner = new Adw.Banner({
                'use-markup': true,
                title: labelText,
                revealed: true,
            });
            infoGroup.add(banner);

            const hibernationGroup = new Adw.PreferencesGroup({
                title: _('Hibernation'),
            });
            this.add(hibernationGroup);

            const hybridSleepRow = new Adw.SwitchRow({
                title: _('Show Hybrid Sleep Button'),
            });
            hibernationGroup.add(hybridSleepRow);

            const hibernateRow = new Adw.SwitchRow({
                title: _('Show Hibernate Button'),
            });
            hibernationGroup.add(hibernateRow);

            settings.bind('show-hybrid-sleep-button', hybridSleepRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            settings.bind('show-hibernate-button', hibernateRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        }
    }
);

export default HibernationPage;

const labelText = '<span size="medium">' +
    'This page is useful only if you have configured HybridSleep and Hibernation yourself,\n' +
    'some useful links on this topic are,\n' +
    '<a href="https://ubuntuhandbook.org/index.php/2021/08/enable-hibernate-ubuntu-21-10/">Link 1</a>\n' +
    '<a href="https://github.com/arelange/gnome-shell-extension-hibernate-status#hibernation-button-does-not-show-up-but-systemctl-hibernate-works">Link 2</a>\n' +
    '<a href="https://support.system76.com/articles/enable-hibernation/">Link 3</a>\n' +
    '<a href="https://extensions.gnome.org/extension/755/hibernate-status-button/">Source</a>\n' +
    '<a href="https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/issues/28">Github Issue</a>' +
    '</span>';
