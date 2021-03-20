'use strict';

const { GObject, Shell, St } = imports.gi;

const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const SystemActions = imports.misc.systemActions;
const ExtensionUtils = imports.misc.extensionUtils;
const System = Main.panel.statusArea.aggregateMenu._system;
const systemMenu = System.menu;

let extSettings = ExtensionUtils.getSettings('org.gnome.shell.extensions.brngout');
let systemActions = new SystemActions.getDefault();
let bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;

let separator1 = new PopupMenu.PopupSeparatorMenuItem;
let suspend;
let restart;
let power;
let separator2 = new PopupMenu.PopupSeparatorMenuItem;
let logout;
let switchUser;

let boolean;

var _bringOut = new Lang.Class({
    Name: "Bring Out Submenu Of Power Off/ Log Out",
    Extends: PanelMenu.SystemIndicator,
//   
_init: function() {
	this._createMenu();
	this._gsettingsChanged();
	this._takeAction();
},
//
_createMenu: function() {
suspend = new PopupMenu.PopupImageMenuItem(_('Suspend'), 'media-playback-pause-symbolic');
suspend.connect('activate', () => { systemActions.activateSuspend(); });

restart = new PopupMenu.PopupImageMenuItem(_('Restart…'), 'system-reboot-symbolic');
restart.connect('activate', () => { systemActions.activateRestart(); });

power = new PopupMenu.PopupImageMenuItem(_('Power Off…'), 'system-shutdown-symbolic');
power.connect('activate', () => { systemActions.activatePowerOff(); });

logout = new PopupMenu.PopupImageMenuItem(_('Log Out'), 'system-log-out-symbolic');
logout.connect('activate', () => { systemActions.activateLogout(); });

switchUser = new PopupMenu.PopupImageMenuItem(_('Switch User…'), 'system-switch-user-symbolic.svg');
switchUser.connect('activate', () => { systemActions.activateSwitchUser(); });
},
//
_takeAction: function() {
this.destroy();
systemMenu.actor.remove_child(System._sessionSubMenu);
this._nextAction();
},
//
_nextAction: function() {
	// Separator1
boolean = extSettings.get_boolean('remove-separator-1');
if (!boolean) { systemMenu.addMenuItem(separator1); };
	// Suspend
boolean = extSettings.get_boolean('remove-suspend-button');
if (!boolean) { systemMenu.addMenuItem(suspend); };
	//Restart
boolean = extSettings.get_boolean('remove-restart-button');	
if (!boolean) { systemMenu.addMenuItem(restart); };
	// Power
boolean = extSettings.get_boolean('remove-power-button');
if (!boolean) { systemMenu.addMenuItem(power); };
	// Separator2
boolean = extSettings.get_boolean('remove-separator-2');
if (!boolean) { systemMenu.addMenuItem(separator2); };
	// Logout
boolean = extSettings.get_boolean('remove-logout-button');
if (!boolean) { systemMenu.addMenuItem(logout); };
	// Switch User
systemMenu.addMenuItem(switchUser); systemActions.bind_property('can-switch-user', switchUser, 'visible', bindFlags);
},
//
_gsettingsChanged: function() {
extSettings.connect("changed::remove-suspend-button", this._takeAction.bind(this));
extSettings.connect("changed::remove-restart-button", this._takeAction.bind(this));
extSettings.connect("changed::remove-power-button", this._takeAction.bind(this));
extSettings.connect("changed::remove-separator-1", this._takeAction.bind(this));
extSettings.connect("changed::remove-separator-2", this._takeAction.bind(this));
extSettings.connect("changed::remove-logout-button", this._takeAction.bind(this));
},
//
destroy: function () {
systemMenu.box.remove_actor(separator1);
systemMenu.box.remove_actor(suspend);
systemMenu.box.remove_actor(restart);
systemMenu.box.remove_actor(power);
systemMenu.box.remove_actor(separator2);
systemMenu.box.remove_actor(logout);
systemMenu.box.remove_actor(switchUser);
systemMenu.box.insert_child_at_index(System._sessionSubMenu, systemMenu.numMenuItems);
}
});
//
function init() {}
//
let modifiedMenu;
//
function enable() {
modifiedMenu = new _bringOut();
}
//
function disable() {
modifiedMenu.destroy();
}
