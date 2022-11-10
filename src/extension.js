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

const { GObject, St } = imports.gi;

const Main = imports.ui.main;
const Target = Main.panel.statusArea.quickSettings._system._systemItem.child;
const { QuickSettingsItem } = imports.ui.quickSettings;
const SystemActions = imports.misc.systemActions;
const TakeAction = new SystemActions.getDefault();

const SuspendItem = GObject.registerClass(
  class SuspendItem extends QuickSettingsItem {
    _init() {
      super._init({
        style_class: 'icon-button',
        can_focus: true,
        child: new St.Icon({ icon_name: 'media-playback-pause-symbolic' }),
        accessible_name: 'Suspend',
      });

      this.connect('clicked', () => {
        TakeAction.activateSuspend();
        Main.panel.closeQuickSettings();
      });
    }
  },
);

const LogoutItem = GObject.registerClass(
  class LogoutItem extends QuickSettingsItem {
    _init() {
      super._init({
        style_class: 'icon-button',
        can_focus: true,
        child: new St.Icon({ icon_name: 'system-log-out-symbolic' }),
        accessible_name: 'Logout',
      });

      this.connect('clicked', () => {
        TakeAction.activateLogout();
        Main.panel.closeQuickSettings();
      });
    }
  },
);

const RestartItem = GObject.registerClass(
  class RestartItem extends QuickSettingsItem {
    _init() {
      super._init({
        style_class: 'icon-button',
        can_focus: true,
        child: new St.Icon({ icon_name: 'system-reboot-symbolic' }),
        accessible_name: 'Restart',
      });

      this.connect('clicked', () => {
        TakeAction.activateRestart();
        Main.panel.closeQuickSettings();
      });
    }
  },
);

const PowerOffItem = GObject.registerClass(
  class PowerOffItem extends QuickSettingsItem {
    _init() {
      super._init({
        style_class: 'icon-button',
        can_focus: true,
        child: new St.Icon({ icon_name: 'system-shutdown-symbolic' }),
        accessible_name: 'Shutdown',
      });

      this.connect('clicked', () => {
        TakeAction.activatePowerOff();
        Main.panel.closeQuickSettings();
      });
    }
  },
);

class Extension {
  enable() {
    Target.get_children()[6].hide();

    this._suspendItem = new SuspendItem();
    this._logoutItem = new LogoutItem();
    this._restartItem = new RestartItem();
    this._powerOffItem = new PowerOffItem();

    Target.add_child(this._suspendItem);
    Target.add_child(this._logoutItem);
    Target.add_child(this._restartItem);
    Target.add_child(this._powerOffItem);
  }

  disable() {
    const array = [this._suspendItem, this._logoutItem, this._restartItem, this._powerOffItem];
    array.forEach((item) => {
      item.destroy();
      item = null;
    });
    Target.get_children()[6].show();
  }
}

function init() {
  return new Extension();
}
