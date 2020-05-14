const { GObject, Shell, St } = imports.gi;
const Lang = imports.lang;
const Main = imports.ui.main;
const Menu = Main.panel.statusArea.aggregateMenu._system.menu;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const SystemActions = imports.misc.systemActions;

const ExtensionUtils = imports.misc.extensionUtils

const BRNGOUT_SCHEMA = 'org.gnome.shell.extensions.brngout';

let separator1 = new PopupMenu.PopupSeparatorMenuItem;
let logout;
let switchUser;
let separator2 = new PopupMenu.PopupSeparatorMenuItem;
let suspend;
let power;
let separator3 = new PopupMenu.PopupSeparatorMenuItem;
let gnomeTweaks

let gnomeTweaksApp = Shell.AppSystem.get_default().lookup_app('org.gnome.tweaks.desktop');

let bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;

var _bringOut = new Lang.Class({
    Name: "Bring Out Submenu Of Power Off/Logout Button and Rearrange the Order of System Menu.",
    Extends: PanelMenu.SystemIndicator,
//   
_init: function() {

	this._settings = ExtensionUtils.getSettings(BRNGOUT_SCHEMA);
	this._systemActions = new SystemActions.getDefault();
	this._createMenu();
	this._gsettingsChanged();
	this._takeAction();
},

//
_createMenu: function() {
logout = new PopupMenu.PopupImageMenuItem(_('Logout'), 'system-log-out-symbolic');
logout.connect('activate', () => { this._systemActions.activateLogout(); });

switchUser = new PopupMenu.PopupImageMenuItem(_('Switch User'), 'system-switch-user-symbolic.svg');
switchUser.connect('activate', () => { this._systemActions.activateSwitchUser(); });

suspend = new PopupMenu.PopupImageMenuItem(_('Suspend'), 'media-playback-pause-symbolic');
suspend.connect('activate', () => { this._systemActions.activateSuspend(); });

power = new PopupMenu.PopupImageMenuItem(_('Power Off'), 'system-shutdown-symbolic');
power.connect('activate', () => { this._systemActions.activatePowerOff(); });

if (gnomeTweaksApp) {
let [name, icon] = [ gnomeTweaksApp.get_name(), gnomeTweaksApp.app_info.get_icon().names[0], ];
gnomeTweaks = new PopupMenu.PopupImageMenuItem(name, icon);
gnomeTweaks.connect('activate', () => { Main.overview.hide(); gnomeTweaksApp.activate(); }); }
else { log('Missing gnomeTweaks'); gnomeTweaks = new St.Widget(); }
},

//
_takeAction: function() {
this.destroy();
Menu.actor.remove_child(Main.panel.statusArea.aggregateMenu._system._sessionSubMenu)
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
if (!this._suspend) { Menu.addMenuItem(suspend); }; this._systemActions.bind_property('can-suspend', suspend, 'visible', bindFlags);
	// Power
this._power = this._settings.get_boolean('remove-power-button'); if (!this._power) { Menu.addMenuItem(power); }; this._systemActions.bind_property('can-power-off', power, 'visible', bindFlags);
	// Separator 3
Menu.addMenuItem(separator3);
	// Gnome Tweaks
if (gnomeTweaksApp) { this._gnomeTweaks = this._settings.get_boolean('show-gnome-tweaks'); if (this._gnomeTweaks) { Menu.addMenuItem(gnomeTweaks); } }
},

//
_gsettingsChanged: function() {
this._settings.connect("changed::remove-suspend-button", this._takeAction.bind(this));
this._settings.connect("changed::remove-power-button", this._takeAction.bind(this));
this._settings.connect("changed::show-gnome-tweaks", this._takeAction.bind(this));
},

//
destroy: function () {
Menu.box.remove_actor(separator1);
Menu.box.remove_actor(logout);
Menu.box.remove_actor(switchUser);
Menu.box.remove_actor(separator2);
Menu.box.remove_actor(suspend);
Menu.box.remove_actor(power);
Menu.box.remove_actor(separator3);
Menu.box.remove_actor(gnomeTweaks);
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
