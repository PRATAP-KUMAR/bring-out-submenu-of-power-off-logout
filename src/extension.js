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
    class SyncLabel extends QuickSettingsItem  {
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


const SuspendItem = GObject.registerClass(
  class SuspendItem extends QuickSettingsItem {
      _init() {
          super._init({
              style_class: 'icon-button',
              can_focus: true,
              track_hover: true,
              child: new St.Icon({icon_name: 'media-playback-pause-symbolic'}),
              accessible_name: 'Suspend',
          });

          this.connect('clicked', () => {
              TakeAction.activateSuspend();
              Main.panel.closeQuickSettings();
          });

          TakeAction.bind_property('can-sunspend', this, 'visible', BindFlags);
          const callSync = new SyncLabel(this);
          this.connect('notify::hover', () => {
              callSync._syncLabel();
          });
      }
  }
);

const SwitchUserItem = GObject.registerClass(
  class SwitchUserItem extends QuickSettingsItem {
      _init() {
          super._init({
              style_class: 'icon-button',
              can_focus: true,
              child: new St.Icon({icon_name: 'system-switch-user-symbolic'}),
              accessible_name: 'Switch User…',
          });

          this.connect('clicked', () => {
              TakeAction.activateSwitchUser();
              Main.panel.closeQuickSettings();
          });

          TakeAction.bind_property('can-switch-user', this, 'visible', BindFlags);
          const callSync = new SyncLabel(this);
          this.connect('notify::hover', () => {
              callSync._syncLabel();
          });
      }
  }
);

const LogoutItem = GObject.registerClass(
  class LogoutItem extends QuickSettingsItem {
      _init() {
          super._init({
              style_class: 'icon-button',
              can_focus: true,
              child: new St.Icon({icon_name: 'system-log-out-symbolic'}),
              accessible_name: 'Log Out…',
          });

          this.connect('clicked', () => {
              TakeAction.activateLogout();
              Main.panel.closeQuickSettings();
          });

          TakeAction.bind_property('can-logout', this, 'visible', BindFlags);
          const callSync = new SyncLabel(this);
          this.connect('notify::hover', () => {
              callSync._syncLabel();
          });
      }
  }
);

const RestartItem = GObject.registerClass(
  class RestartItem extends QuickSettingsItem {
      _init() {
          super._init({
              style_class: 'icon-button',
              can_focus: true,
              child: new St.Icon({icon_name: 'system-reboot-symbolic'}),
              accessible_name: 'Restart…',
          });

          this.connect('clicked', () => {
              TakeAction.activateRestart();
              Main.panel.closeQuickSettings();
          });

          TakeAction.bind_property('can-restart', this, 'visible', BindFlags);
          const callSync = new SyncLabel(this);
          this.connect('notify::hover', () => {
              callSync._syncLabel();
          });
      }
  }
);

const PowerOffItem = GObject.registerClass(
  class PowerOffItem extends QuickSettingsItem {
      _init() {
          super._init({
              style_class: 'icon-button',
              can_focus: true,
              child: new St.Icon({icon_name: 'system-shutdown-symbolic'}),
              accessible_name: 'Power Off…',
          });

          this.connect('clicked', () => {
              TakeAction.activatePowerOff();
              Main.panel.closeQuickSettings();
          });

          TakeAction.bind_property('can-power-off', this, 'visible', BindFlags);
          const callSync = new SyncLabel(this);
          this.connect('notify::hover', () => {
              callSync._syncLabel();
          });
      }
  }
);

let removed = Target.get_children()[6];

class Extension {
    enable() {
        Target.remove_child(removed);

        this._suspendItem = new SuspendItem();
        this._switchUserItem = new SwitchUserItem();
        this._logoutItem = new LogoutItem();
        this._restartItem = new RestartItem();
        this._powerOffItem = new PowerOffItem();

        const array = [
            this._suspendItem,
            this._switchUserItem,
            this._logoutItem,
            this._restartItem,
            this._powerOffItem,
        ];

        array.forEach(item => {
            Target.add_child(item);
        });
    }

    disable() {
        const array = [
            this._suspendItem,
            this._switchUserItem,
            this._logoutItem,
            this._restartItem,
            this._powerOffItem,
        ];

        array.forEach(item => {
            if (item._resetHoverTimeoutId) {
                GLib.source_remove(item._resetHoverTimeoutId);
                item._resetHoverTimeoutId = null;
            }

            if (item._showLabelTimeoutId) {
                GLib.source_remove(item._showLabelTimeoutId);
                item._showLabelTimeoutId = null;
            }
            item.destroy();
            item = null;
        });

        Target.add_child(removed);
    }
}

/**
 *
 */
function init() {
    return new Extension();
}
