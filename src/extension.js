/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const {
    GObject, St, GLib, Clutter,
} = imports.gi;

const Main = imports.ui.main;
const Target = Main.panel.statusArea.quickSettings._system._systemItem.child;
const {QuickSettingsItem} = imports.ui.quickSettings;
const SystemActions = imports.misc.systemActions;
const TakeAction = new SystemActions.getDefault();
const BindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
const ExtensionUtils = imports.misc.extensionUtils;

const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

const LabelLauncher = new GObject.registerClass(
    class LabelLauncher extends St.Widget {
        _init() {
            this.label = new St.Label({style_class: 'dash-label'});
            this.label.hide();
            Main.layoutManager.addTopChrome(this.label);
        }

        showLabel(button) {
            this.label.set_text(button.accessible_name);
            this.label.opacity = 0;
            this.label.show();

            const center = button.get_transformed_position();
            const x = center[0] - 20;
            const y = 10;

            this.label.set_position(x, y);
            this.label.ease({
                opacity: 255,
                duration: 100,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            });
        }

        hideLabel() {
            this.label.ease({
                opacity: 0,
                duration: 500,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                onComplete: () => this.label.hide(),
            });
        }
    }
);

const SyncLabel = GObject.registerClass(
    class SyncLabel extends QuickSettingsItem {
        _init(item) {
            this.item = item;
            this.item._showLabelTimeoutId = 0;
            this.item._resetHoverTimeoutId = 0;
            this.item._labelShowing = false;
            this.toolTip = new LabelLauncher();
            this.toolTip.child = this.item;
        }

        _syncLabel() {
            if (this.toolTip.child.hover) {
                if (this.item._showLabelTimeoutId === 0) {
                    const timeout = this.item._labelShowing ? 0 : 100;
                    this.item._showLabelTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout,
                        () => {
                            this.item._labelShowing = true;
                            this.toolTip.showLabel(this.item);
                            this.item._showLabelTimeoutId = 0;
                            return GLib.SOURCE_REMOVE;
                        });
                    GLib.Source.set_name_by_id(this._showLabelTimeoutId, '[gnome-shell this.toolTip.showLabel');
                    if (this.item._resetHoverTimeoutId > 0) {
                        GLib.source_remove(this.item._resetHoverTimeoutId);
                        this.item._resetHoverTimeoutId = 0;
                    }
                }
            } else {
                if (this.item._showLabelTimeoutId > 0)
                    GLib.source_remove(this.item._showLabelTimeoutId);
                this.item._showLabelTimeoutId = 0;
                this.toolTip.hideLabel();
                if (this.item._labelShowing) {
                    this.item._resetHoverTimeoutId = GLib.timeout_add(
                        GLib.PRIORITY_DEFAULT, 100,
                        () => {
                            this.item._labelShowing = false;
                            this.item._resetHoverTimeoutId = 0;
                            return GLib.SOURCE_REMOVE;
                        }
                    );
                    GLib.Source.set_name_by_id(this.item._resetHoverTimeoutId, '[gnome-shell] this.item._labelShowing');
                }
            }
        }
    });


const CreateItem = GObject.registerClass(
    class CreateItem extends QuickSettingsItem {
        _init(ICON_NAME, ACCESSIBLE_NAME, BINDING_ID, ACTION) {
            super._init({
                style_class: 'icon-button',
                can_focus: true,
                track_hover: true,
                child: new St.Icon({icon_name: ICON_NAME}),
                accessible_name: ACCESSIBLE_NAME,
            });

            this.connect('clicked', () => {
                switch (ACTION) {
                case SUSPEND:
                    TakeAction.activateSuspend();
                    break;
                case SWITCH_USER:
                    TakeAction.activateSwitchUser();
                    break;
                case LOGOUT:
                    TakeAction.activateLogout();
                    break;
                case RESTART:
                    TakeAction.activateRestart();
                    break;
                case POWEROFF:
                    TakeAction.activatePowerOff();
                    break;
                }

                Main.panel.closeQuickSettings();
            });

            TakeAction.bind_property(BINDING_ID, this, 'visible', BindFlags);
            const callSync = new SyncLabel(this);
            this.connect('notify::hover', () => {
                callSync._syncLabel();
            });
        }
    }
);

let removed = Target.get_children()[6];

const keys = [
    'remove-suspend-button',
    null,
    'remove-logout-button',
    'remove-restart-button',
    'remove-power-button',
];

const BringOutExtension = new GObject.registerClass(
    class BringOutExtension extends QuickSettingsItem {
        _init() {
            Target.remove_child(removed);
            this._settings = ExtensionUtils.getSettings();
            this._createMenu();
            this._connectSettings();
        }

        _createMenu() {
            this._suspendItem = new CreateItem('media-playback-pause-symbolic', 'Suspend', 'can-suspend', SUSPEND);
            this._switchUserItem = new CreateItem('system-switch-user-symbolic', 'Switch User…', 'can-switch-user', SWITCH_USER);
            this._logoutItem = new CreateItem('system-log-out-symbolic', 'Log Out…', 'can-logout', LOGOUT);
            this._restartItem = new CreateItem('system-reboot-symbolic', 'Restart…', 'can-restart', RESTART);
            this._powerItem = new CreateItem('system-shutdown-symbolic', 'Power Off…', 'can-power-off', POWEROFF);

            this._array = [
                this._suspendItem,
                this._switchUserItem,
                this._logoutItem,
                this._restartItem,
                this._powerItem,
            ];

            this._array.forEach((item, index) => {
                let boolean;
                if (index !== 1) {
                    let key = keys[index];
                    boolean = this._settings.get_boolean(key);
                    if (!boolean)
                        Target.add(item);
                } else {
                    Target.add(item);
                }
            });
        }

        _connectSettings() {
            this._array.forEach((item, index) => {
                if (index !== 1) {
                    let key = keys[index];
                    item._buttonShowHide = this._settings.connect(`changed::${key}`, this._settingsChanged.bind(this));
                }
            });
        }

        _settingsChanged() {
            this._array.forEach(item => {
                if (item)
                    Target.remove_child(item);
            });
            this._createMenu();
        }

        _destroy() {
            this._array = [
                this._suspendItem,
                this._switchUserItem,
                this._logoutItem,
                this._restartItem,
                this._powerItem,
            ];

            this._array.forEach(item => {
                if (item._resetHoverTimeoutId) {
                    GLib.source_remove(item._resetHoverTimeoutId);
                    item._resetHoverTimeoutId = null;
                }

                if (item._showLabelTimeoutId) {
                    GLib.source_remove(item._showLabelTimeoutId);
                    item._showLabelTimeoutId = null;
                }

                if (item._buttonShowHide)
                    this._settings.disconnect(item._buttonShowHide);

                item.destroy();
                item = null;
            });

            Target.add_child(removed);
        }
    }
);

let modifiedMenu;

class Extension {
    enable() {
        modifiedMenu = new BringOutExtension();
    }

    disable() {
        modifiedMenu._destroy();
        modifiedMenu.destroy();
        modifiedMenu = null;
    }
}

/**
 *
 */
function init() {
    return new Extension();
}
