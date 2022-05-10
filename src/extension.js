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

const GnomeSession = imports.misc.gnomeSession;
let SessionManager = null;

const Config = imports.misc.config;
const SHELL_MAJOR_VERSION = parseInt(Config.PACKAGE_VERSION.split('.')[0]);

let DefaultActions;

var _bringOut = new GObject.registerClass(
class BringOutSubmenu extends PanelMenu.SystemIndicator {

_init() {
	DefaultActions = new SystemActions.getDefault();
	this._settings = ExtensionUtils.getSettings();
	
	SystemMenu.actor.remove_child(System._sessionSubMenu);
	
	this._createMenu();
	this._connectSettings();
	this._takeAction();
	
	SystemMenu.connect('open-state-changed', (menu, open) => {
		if(!open)
		return;
		DefaultActions._sessionUpdated();
		DefaultActions.forceUpdate();
	});
    	}

_createMenu() {
	let bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
	let boolean;
	
	// Suspend

	this._suspend = new PopupMenu.PopupImageMenuItem(_('Suspend'), 'media-playback-pause-symbolic');
	this._suspend.connect('activate', () => {
	DefaultActions.activateSuspend();
	});
	
	boolean = this._settings.get_boolean('remove-suspend-button');
	
	if(!boolean) {
        SystemMenu.addMenuItem(this._suspend);
	DefaultActions.bind_property('can-suspend', this._suspend, 'visible', bindFlags); }
	
				
	// Restart

	this._restart = new PopupMenu.PopupImageMenuItem(_('Restart…'), 'system-reboot-symbolic');
	this._restart.connect('activate', () => {
	SHELL_MAJOR_VERSION >= 40 ? DefaultActions.activateRestart() : SessionManager.RebootRemote();
        });
	
	boolean = this._settings.get_boolean('remove-restart-button');
	
	if(!boolean) {
        SystemMenu.addMenuItem(this._restart);
	SHELL_MAJOR_VERSION >=40 ? DefaultActions.bind_property('can-restart', this._restart, 'visible', bindFlags) :
        				DefaultActions.bind_property('can-power-off', this._restart, 'visible', bindFlags) }
				
	// Power

	this._power = new PopupMenu.PopupImageMenuItem(_('Power Off…'), 'system-shutdown-symbolic');
	this._power.connect('activate', () => { DefaultActions.activatePowerOff(); });
	
	boolean = this._settings.get_boolean('remove-power-button');
	
	if(!boolean) {
        SystemMenu.addMenuItem(this._power);
	DefaultActions.bind_property('can-power-off', this._power, 'visible', bindFlags); }
	
	// Logout

	this._logout = new PopupMenu.PopupImageMenuItem(_('Log Out'), 'system-log-out-symbolic');
	this._logout.connect('activate', () => { DefaultActions.activateLogout(); });
	
	boolean = this._settings.get_boolean('remove-logout-button');
	
	if(!boolean) {
        SystemMenu.addMenuItem(this._logout);
	DefaultActions.bind_property('can-logout', this._logout, 'visible', bindFlags); }
	
	// Switch User

	this._switchUser = new PopupMenu.PopupImageMenuItem(_('Switch User…'), 'system-switch-user-symbolic');
	SystemMenu.addMenuItem(this._switchUser)
	this._switchUser.connect('activate', () => { DefaultActions.activateSwitchUser(); });
	DefaultActions.bind_property('can-switch-user', this._switchUser, 'visible', bindFlags);
	
	// Separators
	
	this._separator1 = new PopupMenu.PopupSeparatorMenuItem;
	this._separator2 = new PopupMenu.PopupSeparatorMenuItem;

	SystemMenu.addMenuItem(this._separator1);
	SystemMenu.addMenuItem(this._separator2);
	
	// Main Course
	
	this._getAvailableButtons();
	
	DefaultActions._sessionUpdated();
	DefaultActions.forceUpdate();	

	}
	
_getAvailableButtons() {
			let BUTTONS_ORDER = this._settings.get_value('buttons-order').deepUnpack();
		   	
		   	const initialArray = [
				System._orientationLockItem,
				System._settingsItem,
				System._lockScreenItem,
				this._suspend,
				this._switchUser,
				this._logout,
				this._restart,
				this._power,
				this._separator1,
				this._separator2
			    	]
				    	
			const orderedArray = BUTTONS_ORDER.map((idx) => initialArray[idx - 1]);
			
			const filterdArray = orderedArray.filter(obj => obj !== null);
			
			for (let i = 0; i < filterdArray.length; i++) {
			SystemMenu.moveMenuItem((filterdArray[i]), i);
			}
	}
	
_connectSettings() {
        this.removeSuspendButtonChanged = this._settings.connect('changed::remove-suspend-button', this._takeAction.bind(this));
        this.removeRestartButtonChanged = this._settings.connect('changed::remove-restart-button', this._takeAction.bind(this));
        this.removePoweroffButtonChanged = this._settings.connect('changed::remove-power-button', this._takeAction.bind(this));
        this.removeLogoutButtonChanged = this._settings.connect('changed::remove-logout-button', this._takeAction.bind(this));
        this.buttonsOrderChanged = this._settings.connect('changed::buttons-order', this._takeAction.bind(this));
	}

_onDestroy() {
	
	if(this.removeSuspendButtonChanged) {
        this._settings.disconnect(this.removeSuspendButtonChanged);
        this.removeSuspendButtonChanged = 0;
        }

        if(this.removeRestartButtonChanged) {
        this._settings.disconnect(this.removeRestartButtonChanged);
        this.removeRestartButtonChanged = 0;
        }
        
        if(this.removePoweroffButtonChanged) {
        this._settings.disconnect(this.removePoweroffButtonChanged);
        this.removePoweroffButtonChanged = 0;
        }
        
	if(this.removeLogoutButtonChanged) {
        this._settings.disconnect(this.removeLogoutButtonChanged);
        this.removeLogoutButtonChanged = 0;
        }
        
        if(this.buttonsOrderChanged) {
        this._settings.disconnect(this.buttonsOrderChanged);
        this.buttonsOrderChanged = 0;
        }
	}
	
_removeActors() {
	SystemMenu.box.remove_actor(this._separator1);
	SystemMenu.box.remove_actor(this._separator2);
	SystemMenu.box.remove_actor(this._suspend);
	SystemMenu.box.remove_actor(this._restart);
	SystemMenu.box.remove_actor(this._power);
	SystemMenu.box.remove_actor(this._logout);
	SystemMenu.box.remove_actor(this._switchUser);
	}
	
_takeAction() {
	this._removeActors();
	this._createMenu();
	}
});

function init() {
}

let modifiedMenu;

function enable() {
SessionManager = GnomeSession.SessionManager();
modifiedMenu = new _bringOut();
}

function disable() {
	if(SessionManager) {
	SessionManager = null;
	}
	
	modifiedMenu._removeActors();
	modifiedMenu._onDestroy();
	modifiedMenu = null;
	
	SystemMenu.moveMenuItem(System._orientationLockItem, 0);		
	SystemMenu.moveMenuItem(System._settingsItem, 1);
	SystemMenu.moveMenuItem(System._lockScreenItem, 2);
	SystemMenu.actor.insert_child_at_index(System._sessionSubMenu, SystemMenu.numMenuItems);
}
