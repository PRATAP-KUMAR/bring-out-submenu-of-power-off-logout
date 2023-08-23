import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GObject from 'gi://GObject';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { QuickSettingsItem } from 'resource:///org/gnome/shell/ui/quickSettings.js';
import CreateItem from './CreateItem.js';

const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

const BringoutExtension = new GObject.registerClass(
    class BringoutExtension extends QuickSettingsItem {
        _init() {
            this._extension = Extension.lookupByURL(import.meta.url);
            this._settings = this._extension.getSettings();
            this._actionItems = Main.panel.statusArea.quickSettings._system._systemItem.child;
            this._powerOffMenuItem = this._actionItems.get_child_at_index(6);
            this._actionItems.remove_child(this._powerOffMenuItem)
            this._items = [];
            this._keys = [];
            this._createMenu();
        }

        _createMenu() {
            this._items = []
            this._keys = []
            this._suspendItem = new CreateItem('media-playback-pause-symbolic', 'Suspend', SUSPEND, 'remove-suspend-button', 'can-suspend');
            this._switchUserItem = new CreateItem('system-switch-user-symbolic', 'Switch User���', SWITCH_USER, null, 'can-switch-user');
            this._logoutItem = new CreateItem('system-log-out-symbolic', 'Log Out���', LOGOUT, 'remove-logout-button', 'can-logout');
            this._restartItem = new CreateItem('system-reboot-symbolic', 'Restart���', RESTART, 'remove-restart-button', 'can-restart');
            this._powerItem = new CreateItem('system-shutdown-symbolic', 'Power Off���', POWEROFF, 'remove-power-button', 'can-power-off');

            this._items = [
                this._suspendItem,
                this._switchUserItem,
                this._logoutItem,
                this._restartItem,
                this._powerItem
            ]

            this._keys = [
                'remove-suspend-button',
                null,
                'remove-logout-button',
                'remove-restart-button',
                'remove-power-button',
            ]

            this._items.forEach((item, idx) => {
                let boolean;
                let key = this._keys[idx]
                if (key) {
                    Main.notify(idx)
                    boolean = this._settings.get_boolean(key);
                    if (!boolean) this._actionItems.add(item);
                } else {
                    this._actionItems.add(item);
                }
            });
        }

        _destroy() {
            this._items.forEach((item) => {
                this._actionItems.remove_child(item);
            });
            this._actionItems.add_child(this._powerOffMenuItem);
        }
    }
)

export default BringoutExtension;