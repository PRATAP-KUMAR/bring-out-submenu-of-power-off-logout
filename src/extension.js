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


'use strict';

const { GObject, Shell, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const SystemActions = imports.misc.systemActions;
const ExtensionUtils = imports.misc.extensionUtils;
const System = Main.panel.statusArea.aggregateMenu._system;
const SystemMenu = System.menu;

const SCHEMA_NAME = 'org.gnome.shell.extensions.brngout';

let DefaultActions;
let separator1;
let suspend;
let restart;
let power;
let separator2;
let logout;
let switchUser;

var _bringOut = new GObject.registerClass(
class BringOutSubmenu extends PanelMenu.SystemIndicator {

_init() {
	DefaultActions = new SystemActions.getDefault();
	separator1 = new PopupMenu.PopupSeparatorMenuItem;
	separator2 = new PopupMenu.PopupSeparatorMenuItem;
	this.gsettings = ExtensionUtils.getSettings(SCHEMA_NAME);
	this._createMenu();
	this._gsettingsChanged();
	this._takeAction();
}

_createMenu() {

suspend = new PopupMenu.PopupImageMenuItem(_('Suspend'), 'media-playback-pause-symbolic');
suspend.connect('activate', () => { DefaultActions.activateSuspend(); });

restart = new PopupMenu.PopupImageMenuItem(_('Restart…'), 'system-reboot-symbolic');
restart.connect('activate', () => { DefaultActions.activateRestart(); });

power = new PopupMenu.PopupImageMenuItem(_('Power Off…'), 'system-shutdown-symbolic');
power.connect('activate', () => { DefaultActions.activatePowerOff(); });

logout = new PopupMenu.PopupImageMenuItem(_('Log Out'), 'system-log-out-symbolic');
logout.connect('activate', () => { DefaultActions.activateLogout(); });

switchUser = new PopupMenu.PopupImageMenuItem(_('Switch User…'), 'system-switch-user-symbolic.svg');
switchUser.connect('activate', () => { DefaultActions.activateSwitchUser(); });
}

_takeAction() {
this.destroy();
SystemMenu.actor.remove_child(System._sessionSubMenu);
this._nextAction();
}

_nextAction() {
let boolean;
	// Separator1
boolean = this.gsettings.get_boolean('remove-separator-1');
if (!boolean) { SystemMenu.addMenuItem(separator1); };
	// Suspend
boolean = this.gsettings.get_boolean('remove-suspend-button');
if (!boolean) { SystemMenu.addMenuItem(suspend); };
	//Restart
boolean = this.gsettings.get_boolean('remove-restart-button');	
if (!boolean) { SystemMenu.addMenuItem(restart); };
	// Power
boolean = this.gsettings.get_boolean('remove-power-button');
if (!boolean) { SystemMenu.addMenuItem(power); };
	// Separator2
boolean = this.gsettings.get_boolean('remove-separator-2');
if (!boolean) { SystemMenu.addMenuItem(separator2); };
	// Logout
boolean = this.gsettings.get_boolean('remove-logout-button');
if (!boolean) { SystemMenu.addMenuItem(logout); };
	// Switch User
SystemMenu.addMenuItem(switchUser);
let bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
DefaultActions.bind_property('can-switch-user', switchUser, 'visible', bindFlags);
}

_gsettingsChanged() {
this.gsettings.connect("changed::remove-suspend-button", this._takeAction.bind(this));
this.gsettings.connect("changed::remove-restart-button", this._takeAction.bind(this));
this.gsettings.connect("changed::remove-power-button", this._takeAction.bind(this));
this.gsettings.connect("changed::remove-separator-1", this._takeAction.bind(this));
this.gsettings.connect("changed::remove-separator-2", this._takeAction.bind(this));
this.gsettings.connect("changed::remove-logout-button", this._takeAction.bind(this));
}

destroy() {
SystemMenu.box.remove_actor(separator1);
SystemMenu.box.remove_actor(suspend);
SystemMenu.box.remove_actor(restart);
SystemMenu.box.remove_actor(power);
SystemMenu.box.remove_actor(separator2);
SystemMenu.box.remove_actor(logout);
SystemMenu.box.remove_actor(switchUser);
SystemMenu.box.insert_child_at_index(System._sessionSubMenu, SystemMenu.numMenuItems);
}
});

function init() {
}

let modifiedMenu;

function enable() {
modifiedMenu = new _bringOut();
}

function disable() {
modifiedMenu.destroy();
}
