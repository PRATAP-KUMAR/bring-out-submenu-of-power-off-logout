'use strict';

const { GObject, Shell, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const SystemActions = imports.misc.systemActions;
const ExtensionUtils = imports.misc.extensionUtils;
const System = Main.panel.statusArea.aggregateMenu._system;
const SystemMenu = System.menu;

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

var _bringOut = new GObject.registerClass(
class BringOutSubmenu extends PanelMenu.SystemIndicator {

_init() {
	this._createMenu();
	this._gsettingsChanged();
	this._takeAction();
}

_createMenu() {
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
}

_takeAction() {
this.destroy();
SystemMenu.actor.remove_child(System._sessionSubMenu);
this._nextAction();
}

_nextAction() {
	// Separator1
boolean = extSettings.get_boolean('remove-separator-1');
if (!boolean) { SystemMenu.addMenuItem(separator1); };
	// Suspend
boolean = extSettings.get_boolean('remove-suspend-button');
if (!boolean) { SystemMenu.addMenuItem(suspend); };
	//Restart
boolean = extSettings.get_boolean('remove-restart-button');	
if (!boolean) { SystemMenu.addMenuItem(restart); };
	// Power
boolean = extSettings.get_boolean('remove-power-button');
if (!boolean) { SystemMenu.addMenuItem(power); };
	// Separator2
boolean = extSettings.get_boolean('remove-separator-2');
if (!boolean) { SystemMenu.addMenuItem(separator2); };
	// Logout
boolean = extSettings.get_boolean('remove-logout-button');
if (!boolean) { SystemMenu.addMenuItem(logout); };
	// Switch User
SystemMenu.addMenuItem(switchUser); systemActions.bind_property('can-switch-user', switchUser, 'visible', bindFlags);
}

_gsettingsChanged() {
extSettings.connect("changed::remove-suspend-button", this._takeAction.bind(this));
extSettings.connect("changed::remove-restart-button", this._takeAction.bind(this));
extSettings.connect("changed::remove-power-button", this._takeAction.bind(this));
extSettings.connect("changed::remove-separator-1", this._takeAction.bind(this));
extSettings.connect("changed::remove-separator-2", this._takeAction.bind(this));
extSettings.connect("changed::remove-logout-button", this._takeAction.bind(this));
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

function init() {}

let modifiedMenu;

function enable() {
modifiedMenu = new _bringOut();
}

function disable() {
modifiedMenu.destroy();
}
