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
    GObject, St, GLib, Clutter, Gio,
} = imports.gi;

const Main = imports.ui.main;
const Target = Main.panel.statusArea.quickSettings._system._systemItem.child;
const { QuickSettingsItem } = imports.ui.quickSettings;
const SystemActions = imports.misc.systemActions;
const BindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const iconsPath = Me.dir.get_child('icons').get_path();

const SUSPEND = 'suspend';
const HYBRID_SLEEP = 'hybrid_sleep';
const HIBERNATE = 'hibernate';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

/**
 *
 * @param {string} input - HybridSleep/Hibernate
 */
function hybridSleepOrHibernate(input) {
    const LoginManager = imports.misc.loginManager.getLoginManager();
    if (LoginManager._proxy)
        LoginManager._proxy.call(input, GLib.Variant.new('(b)', [true]), Gio.DBusCallFlags.NONE, -1, null, null);
}

let powerMenu;
let lockItem;
let items;
let keys;
let buttons;

const LabelLauncher = new GObject.registerClass(
    class LabelLauncher extends St.Widget {
        _init() {
            this.label = new St.Label({ style_class: 'dash-label' });
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
        _init(ICON_NAME, ACCESSIBLE_NAME, ACTION, KEY = null, BINDING_ID = null) {
            super._init({
                style_class: 'icon-button',
                can_focus: true,
                track_hover: true,
                child: ICON_NAME.startsWith('bosm-') ? new St.Icon({ gicon: Gio.icon_new_for_string(`${iconsPath}/${ICON_NAME}`) }) : new St.Icon({ icon_name: ICON_NAME }),
                accessible_name: ACCESSIBLE_NAME,
            });

            const TakeAction = new SystemActions.getDefault();

            this.connect('clicked', () => {
                switch (ACTION) {
                    case SUSPEND:
                        TakeAction.activateSuspend();
                        break;
                    case HYBRID_SLEEP:
                        hybridSleepOrHibernate('HybridSleep');
                        break;
                    case HIBERNATE:
                        hybridSleepOrHibernate('Hibernate');
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

            if (BINDING_ID)
                TakeAction.bind_property(BINDING_ID, this, 'visible', BindFlags);

            items.push(this);
            keys.push(KEY);
        }
    }
);

const BringOutExtension = new GObject.registerClass(
    class BringOutExtension extends QuickSettingsItem {
        _init() {
            Target.remove_child(powerMenu);
            this._settings = ExtensionUtils.getSettings();
            this._sessionManagerSettings = new Gio.Settings({ schema_id: 'org.gnome.SessionManager' });
            this._lockDownSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.lockdown' });
            this._createMenu();
            this._connectSettings();
            this._lockScreenChanged();
            this._confirmationDialogChanged();
        }

        _createMenu() {
            items = [];
            keys = [];
            buttons = [];
            this._suspendItem = new CreateItem('media-playback-pause-symbolic', 'Suspend', SUSPEND, 'remove-suspend-button', 'can-suspend');
            this._hybridSleepItem = new CreateItem('bosm-hybrid-sleep-symbolic.svg', 'Hybrid Sleep', HYBRID_SLEEP, 'remove-hybrid-sleep-button');
            this._hibernateItem = new CreateItem('bosm-hibernate-symbolic.svg', 'Hibernate', HIBERNATE, 'remove-hibernate-button');
            this._switchUserItem = new CreateItem('system-switch-user-symbolic', 'Switch User…', SWITCH_USER, null, 'can-switch-user');
            this._logoutItem = new CreateItem('system-log-out-symbolic', 'Log Out…', LOGOUT, 'remove-logout-button', 'can-logout');
            this._restartItem = new CreateItem('system-reboot-symbolic', 'Restart…', RESTART, 'remove-restart-button', 'can-restart');
            this._powerItem = new CreateItem('system-shutdown-symbolic', 'Power Off…', POWEROFF, 'remove-power-button', 'can-power-off');

            items.forEach((item, index) => {
                let boolean;
                let key = keys[index];
                if (key) {
                    boolean = this._settings.get_boolean(key);
                    if (!boolean)
                        Target.add(item);
                } else {
                    Target.add(item);
                }
            });

            buttons = Main.panel.statusArea.quickSettings._system._systemItem.child.get_children();
            buttons.forEach(button => {
                if (button.accessible_name) {
                    const callSync = new SyncLabel(button);
                    button._handlerId = button.connect('notify::hover', () => {
                        callSync._syncLabel();
                    });
                }
            });
        }

        _connectSettings() {
            items.forEach((item, index) => {
                let key = keys[index];
                if (key)
                    item._buttonShowHide = this._settings.connect(`changed::${key}`, this._settingsChanged.bind(this));
            });

            this._lockScreenId = this._settings.connect('changed::remove-lock-button', this._lockScreenChanged.bind(this));
            this._lockDownlockScreenId = this._lockDownSettings.connect('changed::disable-lock-screen', this._lockScreenChanged.bind(this));
            this._confirmId = this._settings.connect('changed::confirmation-dialog', this._confirmationDialogChanged.bind(this));
            this._sMSId = this._sessionManagerSettings.connect('changed::logout-prompt', this._logoutPromptChanged.bind(this));
        }

        _settingsChanged() {
            items.forEach(item => {
                if (item)
                    Target.remove_child(item);
            });
            this._createMenu();
        }

        _lockScreenChanged() {
            let systemDconf = this._lockDownSettings.get_boolean('disable-lock-screen');
            if (systemDconf) {
                lockItem.hide();
                return;
            }
            if (lockItem) {
                let localDconf = this._settings.get_boolean('remove-lock-button');
                if (!localDconf) {
                    lockItem.show();
                } else {
                    lockItem.hide();
                }
            }
        }

        _confirmationDialogChanged() {
            this._sessionManagerSettings.set_boolean('logout-prompt', this._settings.get_boolean('confirmation-dialog'));
        }

        _logoutPromptChanged() {
            this._settings.set_boolean('confirmation-dialog', this._sessionManagerSettings.get_boolean('logout-prompt'));
        }

        _destroy() {
            items.forEach(item => {
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

            buttons.forEach(button => {
                if (button._handlerId)
                    button.disconnect(button._handlerId);
            });

            if (this._lockScreenId)
                this._settings.disconnect(this._lockScreenId);

            if (this._lockDownlockScreenId)
                this._settings.disconnect(this._lockDownlockScreenId);

            if (this._confirmId)
                this._settings.disconnect(this._confirmId);

            if (this._sMSId)
                this._settings.disconnect(this._sMSId);

            let systemDconf = this._lockDownSettings.get_boolean('disable-lock-screen');
            if (systemDconf) {
                lockItem.hide();
            } else {
                lockItem.show();
            }

            Target.add_child(powerMenu);
            lockItem = null;
            powerMenu = null;
            items = [];
            keys = [];
            buttons = [];
        }
    }
);

let modifiedMenu;

class Extension {
    enable() {
        lockItem = Target.get_children()[5];
        powerMenu = Target.get_children()[6];
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
