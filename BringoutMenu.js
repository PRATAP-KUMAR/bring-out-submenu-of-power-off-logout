import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';

import CreateActionItem from './CreateActionItem.js';
import SyncLabel from './SyncLabel.js';

const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

let actionButtons;

const BringoutMenu = new GObject.registerClass(
    class BringoutMenu extends QuickSettingsItem {
        _init(settings) {
            this._settings = settings;
            this._lockDownSettings = new Gio.Settings({schema_id: 'org.gnome.desktop.lockdown'});
            this._containerRow = Main.panel.statusArea.quickSettings._system._systemItem.child;
            this._powerOffMenuItem = this._containerRow.get_child_at_index(6);
            this._lockItem = this._containerRow.get_child_at_index(5);
            this._containerRow.remove_child(this._powerOffMenuItem);
            this._customButtons = [];
            this._keys = [];
            this._instancesOfSyncLabels = [];
            this._instancesOfLabelLaunchers = [];
            this._createMenu();
            this._lockScreenChanged();
            this._connectSettings();
        }

        _connectSettings() {
            this._customButtons.forEach((button, idx) => {
                let key = this._keys[idx];
                if (key)
                    // settings id to destroy - Ref 1
                    button._settingsId = this._settings.connect(`changed::${key}`, this._settingsChanged.bind(this));
            });
            // id to destory - Ref 2
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
            this._customButtons.forEach(item => {
                if (item)
                    this._containerRow.remove_child(item);
            });
            this._createMenu();
        }

        _createMenu() {
            this._customButtons = [];
            this._keys = [];
            this._instancesOfSyncLabels = [];
            this._instancesOfLabelLaunchers = [];
            this._suspendItem = new CreateActionItem('media-playback-pause-symbolic', 'Suspend', SUSPEND, 'can-suspend');
            this._switchUserItem = new CreateActionItem('system-switch-user-symbolic', 'Switch User', SWITCH_USER, 'can-switch-user');
            this._logoutItem = new CreateActionItem('system-log-out-symbolic', 'Log Out', LOGOUT, 'can-logout');
            this._restartItem = new CreateActionItem('system-reboot-symbolic', 'Restart', RESTART, 'can-restart');
            this._powerItem = new CreateActionItem('system-shutdown-symbolic', 'Power Off', POWEROFF, 'can-power-off');

            this._customButtons = [
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

            this._customButtons.forEach((button, idx) => {
                let boolean;
                let key = this._keys[idx];
                if (key) {
                    boolean = this._settings.get_boolean(key);
                    if (!boolean)
                        this._containerRow.add(button);
                } else {
                    this._containerRow.add(button);
                }
            });

            actionButtons = this._containerRow.get_children();
            actionButtons.forEach(button => {
                if (button.accessible_name) {
                    const callSync = new SyncLabel(button);

                    // stack instances of SyncLabel to use in _destroy() - Ref 3
                    this._instancesOfSyncLabels.push(callSync);

                    // stack St label widget from Line 12 of LabelLauncher.js to remove in _destroy() - Ref 4
                    this._instancesOfLabelLaunchers.push(callSync._toolTip);

                    // button handler id's to destroy - Ref 5
                    button._handlerId = button.connect('notify::hover', () => {
                        callSync._syncLabel();
                    });
                }
            });
        }

        _destroy() {
            // Ref 1
            this._customButtons.forEach(button => {
                if (button._settingsId)
                    this._settings.disconnect(button._settingsId);
            });

            // Ref 2
            if (this._lockScreenId)
                this._settings.disconnect(this._lockScreenId);

            // Ref 3
            this._instancesOfSyncLabels.forEach(instance => {
                instance._destroy();
            });

            // Ref 4
            this._instancesOfLabelLaunchers.forEach(instance => {
                instance._destroy();
            });

            // Ref 5
            actionButtons.forEach(button => {
                if (button._handlerId)
                    button.disconnect(button._handlerId);
            });

            this._customButtons.forEach(button => {
                this._containerRow.remove_child(button);
                button.destroy();
                button = null;
            });

            let systemDconf = this._lockDownSettings.get_boolean('disable-lock-screen');
            if (systemDconf)
                this._lockItem.hide();
            else
                this._lockItem.show();

            this._customButtons = [];
            this._keys = [];
            this._instancesOfSyncLabels = [];
            this._instancesOfLabelLaunchers = [];
            this._containerRow.add_child(this._powerOffMenuItem);
        }
    }
);

export default BringoutMenu;
