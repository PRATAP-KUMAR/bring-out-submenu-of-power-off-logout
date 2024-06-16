import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

const HibernationPage = new GObject.registerClass(
    class HibernationPage extends Adw.PreferencesPage {
        constructor(settings, gettext) {
            const _ = gettext;

            const labelText =
                `${_('This page is useful only if Hybrid Sleep and Hibernation are already working on yoursystem, ') +
                _('some useful links on this topic are ')
                }<a href="https://ubuntuhandbook.org/index.php/2021/08/enable-hibernate-ubuntu-21-10/">Ubuntu Hand Book</a> | ` +
                '<a href="https://github.com/arelange/gnome-shell-extension-hibernate-status#hibernation-button-does-not-show-up-but-systemctl-hibernate-works">Github</a> | ' +
                '<a href="https://support.system76.com/articles/enable-hibernation/">System 76</a> | ' +
                '<a href="https://extensions.gnome.org/extension/755/hibernate-status-button/">Source</a> | ' +
                '<a href="https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/issues/28">Github Issue</a>';

            super({
                title: _('Hibernation Settings'),
                icon_name: 'preferences-system-symbolic',
            });

            const infoGroup = new Adw.PreferencesGroup({
                title: _('Important Info'),
            });
            this.add(infoGroup);

            let banner = new Adw.Banner({
                title: _(labelText),
                revealed: true,
                'use-markup': true,
            });
            infoGroup.add(banner);

            const hibernationGroup = new Adw.PreferencesGroup({
                title: _('Hibernation'),
            });
            this.add(hibernationGroup);

            const hybridSleepRow = new Adw.SwitchRow({
                title: _('Hide Hybrid Sleep Button'),
                subtitle: _('you can set the logo by placing an svg icon with the name "hybrid-sleep-symbolic.svg" in ".icons" folder of home directory'),
            });
            hibernationGroup.add(hybridSleepRow);

            const hibernateRow = new Adw.SwitchRow({
                title: _('Hide Hibernate Button'),
                subtitle: _('you can set the logo by placing an svg icon with the name "hibernate-symbolic.svg" in ".icons" folder of home directory'),
            });
            hibernationGroup.add(hibernateRow);

            settings.bind('hide-hybrid-sleep-button', hybridSleepRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            settings.bind('hide-hibernate-button', hibernateRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        }
    }
);

export default HibernationPage;
