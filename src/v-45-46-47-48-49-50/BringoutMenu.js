import GObject from 'gi://GObject';

import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';

import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import CreateActionItem from './BringoutExtensionActionItem.js';

const LOCK = 'lock';
const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

const BringoutMenu = new GObject.registerClass(
    class BringoutMenu extends QuickSettingsItem {
        _init(settings) {
            this._settings = settings;

            this._systemActions = new SystemActions.getDefault();

            this._systemItem = Main.panel.statusArea.quickSettings._system._systemItem;
            this._containerRow = this._systemItem.child;
            this._systemItems = this._containerRow.get_children();

            this._lockItem = this._systemItems.find(child => child.constructor?.name === 'LockItem');
            this._lockItemPosition = this._systemItems.findIndex(item => item.constructor?.name === 'LockItem');

            this._powerOffMenuItem = this._systemItems.find(child => child.constructor?.name === 'ShutdownItem');
            this._powerOffMenuItemPosition = this._systemItems.findIndex(item => item.constructor?.name === 'ShutdownItem');

            this._powerOffMenuItem.add_style_class_name('brng-out-ext-original-power-button-border');

            this._createMenu();
            this._connectSettings();
            this._sChanged();
        }

        _createMenu() {
            this._customButtons = [];
            this._keys = [];

            if (this._lockItem)
                this._containerRow.remove_child(this._lockItem);

            if (this._powerOffMenuItem)
                this._containerRow.remove_child(this._powerOffMenuItem);

            this._lockItemCustom = new CreateActionItem('system-lock-screen-symbolic', 'Lock Screen', LOCK);

            this._suspendItem = new CreateActionItem('media-playback-pause-symbolic', 'Suspend', SUSPEND);

            this._switchUserItem = new CreateActionItem('system-switch-user-symbolic', 'Switch User', SWITCH_USER);
            this._logoutItem = new CreateActionItem('system-log-out-symbolic', 'Log Out', LOGOUT);
            this._restartItem = new CreateActionItem('system-reboot-symbolic', 'Restart', RESTART);
            this._powerItem = new CreateActionItem('system-shutdown-symbolic', 'Power Off', POWEROFF);

            this._customButtons = [
                this._lockItemCustom,
                this._suspendItem,
                this._switchUserItem,
                this._logoutItem,
                this._restartItem,
                this._powerItem,
            ];

            this._keys = [
                'hide-lock-button',
                'hide-suspend-button',
                'hide-switch-user-button',
                'hide-logout-button',
                'hide-restart-button',
                'hide-power-button',
            ];

            this._containerRow.insert_child_at_index(this._lockItemCustom, this._lockItemPosition);

            this._customButtons.forEach(button => {
                if (button !== this._lockItemCustom)
                    this._containerRow.add_child(button);
            });

            this._customButtons.forEach((button, idx) => {
                let key = this._keys[idx];
                if (key)
                    this._settingsChanged(button, key);
            });
        }

        _connectSettings() {
            this._customButtons.forEach((button, idx) => {
                let key = this._keys[idx];
                if (key)
                    button._settingsId = this._settings.connect(`changed::${key}`, this._settingsChanged.bind(this, button, key));
            });

            this._powerOffMenuItem._settingsId = this._settings.connect('changed::show-original-power-button', this._sChanged.bind(this));
        }

        _settingsChanged(button, key) {
            let shallHideButton = this._settings.get_boolean(key);

            if (shallHideButton)
                button.hide();
            else
                button.show();
        }

        _sChanged() {
            let shallShowOriginalPowerButton = this._settings.get_boolean('show-original-power-button');
            if (shallShowOriginalPowerButton)
                this._containerRow.insert_child_at_index(this._powerOffMenuItem, this._lockItemPosition + 1);
            else
                this._containerRow.remove_child(this._powerOffMenuItem);
        }

        _destroy() {
            this._customButtons.forEach(button => {
                if (button._settingsId)
                    this._settings.disconnect(button._settingsId);
            });

            if (this._powerOffMenuItem._settingsId)
                this._settings.disconnect(this._powerOffMenuItem._settingsId);

            this._customButtons.forEach(button => {
                this._containerRow.remove_child(button);
                button.destroy();
                button = null;
            });

            this._customButtons = [];
            this._keys = [];

            if (this._lockItem)
                this._containerRow.insert_child_at_index(this._lockItem, this._lockItemPosition);

            if (this._powerOffMenuItem)
                this._containerRow.insert_child_at_index(this._powerOffMenuItem, this._powerOffMenuItemPosition);

            this._powerOffMenuItem.remove_style_class_name('brng-out-ext-original-power-button-border');

            this._systemActions._updateSwitchUser();
            this._systemActions._updateLogout();
            this._systemActions.forceUpdate();

            this._systemActions = null;
        }
    }
);

export default BringoutMenu;
