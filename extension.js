const { GObject, Shell, St } = imports.gi;
const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const SystemActions = imports.misc.systemActions;

const Menu = Main.panel.statusArea.aggregateMenu._system.menu;

const ExtensionUtils = imports.misc.extensionUtils;

let separator1 = new PopupMenu.PopupSeparatorMenuItem;
let logout;
let switchUser;
let separator2 = new PopupMenu.PopupSeparatorMenuItem;
let suspend;
let restart;
let power;

let bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;

var _bringOut = new Lang.Class({
    Name: "Bring Out Submenu Of Power Off/ Log Out",
    Extends: PanelMenu.SystemIndicator,
//   
_init: function() {
	this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.brngout');
	this._systemActions = new SystemActions.getDefault();
	this._createMenu();
	this._gsettingsChanged();
	this._takeAction();
},

//
_createMenu: function() {
logout = new PopupMenu.PopupImageMenuItem(_('Log Out'), 'system-log-out-symbolic');
logout.connect('activate', () => { this._systemActions.activateLogout(); });

switchUser = new PopupMenu.PopupImageMenuItem(_('Switch User…'), 'system-switch-user-symbolic.svg');
switchUser.connect('activate', () => { this._systemActions.activateSwitchUser(); });

suspend = new PopupMenu.PopupImageMenuItem(_('Suspend'), 'media-playback-pause-symbolic');
suspend.connect('activate', () => { this._systemActions.activateSuspend(); });

restart = new PopupMenu.PopupImageMenuItem(_('Restart'), 'system-reboot-symbolic');
restart.connect('activate', () => { imports.misc.gnomeSession.SessionManager().RebootRemote(); });

power = new PopupMenu.PopupImageMenuItem(_('Power Off…'), 'system-shutdown-symbolic');
power.connect('activate', () => { this._systemActions.activatePowerOff(); });
},

//
_takeAction: function() {
this.destroy();
Menu.actor.remove_child(Main.panel.statusArea.aggregateMenu._system._sessionSubMenu);
this._nextAction();
},

//
_nextAction: function() {
	// Separator 1
Menu.addMenuItem(separator1);
	// Logout
Menu.addMenuItem(logout); this._systemActions.bind_property('can-logout', logout, 'visible', bindFlags);
	// Switch User
Menu.addMenuItem(switchUser); this._systemActions.bind_property('can-switch-user', switchUser, 'visible', bindFlags);
	// Separator 2
Menu.addMenuItem(separator2);
	// Suspend
this._suspend = this._settings.get_boolean('remove-suspend-button');
if (!this._suspend) { Menu.addMenuItem(suspend); };
this._systemActions.bind_property('can-suspend', suspend, 'visible', bindFlags);
	//Restart
this._restart = this._settings.get_boolean('show-restart-button');	
if (this._restart) { Menu.addMenuItem(restart); };
this._systemActions.bind_property('can-logout', restart, 'visible', bindFlags);	
	// Power
this._power = this._settings.get_boolean('remove-power-button'); if (!this._power) { Menu.addMenuItem(power); }; this._systemActions.bind_property('can-power-off', power, 'visible', bindFlags);
},

//
_gsettingsChanged: function() {
this._settings.connect("changed::remove-suspend-button", this._takeAction.bind(this));
this._settings.connect("changed::remove-power-button", this._takeAction.bind(this));
this._settings.connect("changed::show-restart-button", this._takeAction.bind(this));
},

//
destroy: function () {
Menu.box.remove_actor(separator1);
Menu.box.remove_actor(logout);
Menu.box.remove_actor(switchUser);
Menu.box.remove_actor(separator2);
Menu.box.remove_actor(suspend);
Menu.box.remove_actor(restart);
Menu.box.remove_actor(power);
Menu.box.insert_child_at_index(Main.panel.statusArea.aggregateMenu._system._sessionSubMenu, Main.panel.statusArea.aggregateMenu._system.menu.numMenuItems);
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
