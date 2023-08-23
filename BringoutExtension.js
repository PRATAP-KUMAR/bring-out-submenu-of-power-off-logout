import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import CreateItem from './CreateItem.js';
import SyncLabel from './SyncLabel.js';

const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

let actionButtons;

const BringoutExtension = new GObject.registerClass(
    class BringoutExtension extends QuickSettingsItem {
        _init() {
            this._extension = Extension.lookupByURL(import.meta.url);
            this._settings = this._extension.getSettings();
            this._lockDownSettings = new Gio.Settings({schema_id: 'org.gnome.desktop.lockdown'});
            this._actionItems = Main.panel.statusArea.quickSettings._system._systemItem.child;
            this._powerOffMenuItem = this._actionItems.get_child_at_index(6);
            this._lockItem = this._actionItems.get_child_at_index(5);
            this._actionItems.remove_child(this._powerOffMenuItem);
            this._items = [];
            this._keys = [];
            this._createMenu();
            this._lockScreenChanged();
            this._connectSettings();
        }

        _connectSettings() {
            this._items.forEach((item, idx) => {
                let key = this._keys[idx];
                if (key)
                    item._buttonToggle = this._settings.connect(`changed::${key}`, this._settingsChanged.bind(this));
            });

            this._lockScreenId = this._settings.connect('changed::remove-lock-button', this._lockScreenChanged.bind(this));
        }

        _lockScreenChanged() {
            let systemDconf = this._lockDownSettings.get_boolean('disable-lock-screen');
            if (systemDconf) {
                this._lockItem.hide();
                return;
            }
            if (this._lockItem) {
                let localDconf = this._settings.get_boolean('remove-lock-button');
                if (!localDconf)
                    this._lockItem.show();
                else
                    this._lockItem.hide();
            }
        }

        _settingsChanged() {
            this._items.forEach(item => {
                if (item)
                    this._actionItems.remove_child(item);
            });
            this._createMenu();
        }

        _createMenu() {
            this._items = [];
            this._keys = [];
            this._suspendItem = new CreateItem('media-playback-pause-symbolic', 'Suspend', SUSPEND, 'can-suspend');
            this._switchUserItem = new CreateItem('system-switch-user-symbolic', 'Switch User���', SWITCH_USER, 'can-switch-user');
            this._logoutItem = new CreateItem('system-log-out-symbolic', 'Log Out', LOGOUT, 'can-logout');
            this._restartItem = new CreateItem('system-reboot-symbolic', 'Restart', RESTART, 'can-restart');
            this._powerItem = new CreateItem('system-shutdown-symbolic', 'Power Off', POWEROFF, 'can-power-off');

            this._items = [
                this._suspendItem,
                this._switchUserItem,
                this._logoutItem,
                this._restartItem,
                this._powerItem,
            ];

            this._keys = [
                'remove-suspend-button',
                null,
                'remove-logout-button',
                'remove-restart-button',
                'remove-power-button',
            ];

            this._items.forEach((item, idx) => {
                let boolean;
                let key = this._keys[idx];
                if (key) {
                    boolean = this._settings.get_boolean(key);
                    if (!boolean)
                        this._actionItems.add(item);
                } else {
                    this._actionItems.add(item);
                }
            });

            actionButtons = this._actionItems.get_children();
            actionButtons.forEach(button => {
                if (button.accessible_name) {
                    const callSync = new SyncLabel(button);
                    button._handlerId = button.connect('notify::hover', () => {
                        callSync._syncLabel();
                    });
                }
            });
        }

        _destroy() {
            this._items.forEach(item => {
                if (item._buttonToggle)
                    this._settings.disconnect(item._buttonToggle);
                this._actionItems.remove_child(item);
                item.destroy();
                item = null;
            });

            if (this._lockScreenId)
                this._settings.disconnect(this._lockScreenId);

            let systemDconf = this._lockDownSettings.get_boolean('disable-lock-screen');
            if (systemDconf)
                this._lockItem.hide();
            else
                this._lockItem.show();


            actionButtons.forEach(button => {
                if (button._handlerId)
                    button.disconnect(button._handlerId);
            });

            this._items = [];
            this._keys = [];
            this._actionItems.add_child(this._powerOffMenuItem);
        }
    }
);

export default BringoutExtension;
