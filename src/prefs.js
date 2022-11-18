const {Gtk} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

/**
 *
 */
function init() {
}

/**
 *
 */
function buildPrefsWidget() {
    let widget = new PrefsWidget();
    return widget.widget;
}

class CreateButton {
    constructor(label, key) {
        this._label = label;
        this._key = key;
    }

    _createButton() {
        this._settings = ExtensionUtils.getSettings();
        const hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
        const buttonLabel = new Gtk.Label({label: this._label, xalign: 0, hexpand: true});
        const toggleSwitch = new Gtk.Switch({active: this._settings.get_boolean(this._key)});
        toggleSwitch.connect('notify::active', button => {
            this._settings.set_boolean(this._key, button.active);
        });

        hbox.append(buttonLabel);
        hbox.append(toggleSwitch);

        return hbox;
    }
}

class PrefsWidget {
    constructor() {
        this.widget = new Gtk.Grid({visible: true, column_homogeneous: true});
        this.notebook = new Gtk.Notebook({visible: true});

        this.widget.attach(this.notebook, 0, 0, 1, 1);

        // Basic Settings Page

        let grid = new Gtk.Grid({
            column_spacing: 12, row_spacing: 12,
            column_homogeneous: true,
            hexpand: true, vexpand: true,
            margin_start: 14, margin_end: 14, margin_top: 14, margin_bottom: 14,
            visible: true,
        });

        let vbox = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 10, visible: true});

        grid.attach(vbox, 0, 0, 3, 1);

        this._suspendButton = new CreateButton('Remove Suspend Button', 'remove-suspend-button');
        vbox.append(this._suspendButton._createButton());

        this._logoutButton = new CreateButton('Remove Logout Button', 'remove-logout-button');
        vbox.append(this._logoutButton._createButton());

        this._restartButton = new CreateButton('Remove Restart Button', 'remove-restart-button');
        vbox.append(this._restartButton._createButton());

        this._powerButton = new CreateButton('Remove Poweroff Button', 'remove-power-button');
        vbox.append(this._powerButton._createButton());

        this.notebook.append_page(grid, new Gtk.Label({label: 'Basic Settings', visible: true, hexpand: true}));
    }
}
