'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function buildPrefsWidget() {

    let gschema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    this.settings = new Gio.Settings({
        settings_schema: gschema.lookup('org.gnome.shell.extensions.brngout', true)
    });

    let prefsWidget = new Gtk.Grid({
        margin: 5,
        column_spacing: 2,
        row_spacing: 4,
        visible: true
    });
    
    /////////////////////////////////////////////////////////////////////////////    

    let labelSuspend = new Gtk.Label({
        label: 'Remove Suspend Button',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelSuspend, 0, 1, 1, 1);

    let toggleSuspend = new Gtk.Switch({
        active: this.settings.get_boolean('remove-suspend-button'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggleSuspend, 1, 1, 1, 1);

    this.settings.bind(
        'remove-suspend-button',
        toggleSuspend,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );
    
    /////////////////////////////////////////////////////////////////////////////

    let labelRestart = new Gtk.Label({
        label: 'Remove Restart Button',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelRestart, 0, 2, 1, 1);

    let toggleRestart = new Gtk.Switch({
        active: this.settings.get_boolean ('remove-restart-button'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggleRestart, 1, 2, 1, 1);

    this.settings.bind(
        'remove-restart-button',
        toggleRestart,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );
    
    /////////////////////////////////////////////////////////////////////////////

    let labelPower = new Gtk.Label({
        label: 'Remove Power Button',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelPower, 0, 3, 1, 1);

    let togglePower = new Gtk.Switch({
        active: this.settings.get_boolean ('remove-power-button'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(togglePower, 1, 3, 1, 1);

    this.settings.bind(
        'remove-power-button',
        togglePower,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );
    
    /////////////////////////////////////////////////////////////////////////////  
    
    let labelSeparator1 = new Gtk.Label({
        label: 'Remove Separator-1',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelSeparator1, 0, 4, 1, 1);

    let toggleSeparator1 = new Gtk.Switch({
        active: this.settings.get_boolean ('remove-separator-1'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggleSeparator1, 1, 4, 1, 1);

    this.settings.bind(
        'remove-separator-1',
        toggleSeparator1,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );
    
    ///////////////////////////////////////////////////////////////////////////// 
    
    let labelSeparator2 = new Gtk.Label({
        label: 'Remove Separator-2',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelSeparator2, 0, 5, 1, 1);

    let toggleSeparator2 = new Gtk.Switch({
        active: this.settings.get_boolean ('remove-separator-2'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggleSeparator2, 1, 5, 1, 1);

    this.settings.bind(
        'remove-separator-2',
        toggleSeparator2,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );
    
    /////////////////////////////////////////////////////////////////////////////
    
    let labelLogout = new Gtk.Label({
        label: 'Remove Logout',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelLogout, 0, 6, 1, 1);

    let toggleLogout = new Gtk.Switch({
        active: this.settings.get_boolean ('remove-logout-button'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggleLogout, 1, 6, 1, 1);

    this.settings.bind(
        'remove-logout-button',
        toggleLogout,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );
    
    /////////////////////////////////////////////////////////////////////////////      
    
    let labelWarning = new Gtk.Label({
        label: 'Note: if you have set gsettings set org.gnome.desktop.lockdown disable-log-out to true(default is false) then "Restart…", "Power Off…" & "Log Out" will not take any Action when you click on them.',
        halign: Gtk.Align.CENTER,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(labelWarning, 0, 7, 2, 1);

    return prefsWidget;
}
