const {Gtk, Gio} = imports.gi;
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

const createGrid = () =>
    new Gtk.Grid({
        column_spacing: 12, row_spacing: 12,
        column_homogeneous: true,
        hexpand: true, vexpand: true,
        margin_start: 14, margin_end: 14, margin_top: 14, margin_bottom: 14,
        visible: true,
    });

const createVBox = () =>
    new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 10, visible: true});

class PrefsWidget {
    constructor() {
        this.widget = new Gtk.Grid({visible: true, column_homogeneous: true});
        this.notebook = new Gtk.Notebook({visible: true});

        this.widget.attach(this.notebook, 0, 0, 1, 1);

        // Basic Settings Page

        const basicPageGrid = createGrid();
        const basicPageVBox = createVBox();

        basicPageGrid.attach(basicPageVBox, 0, 0, 3, 1);

        this._lockButton = new CreateButton('Remove Lock Button', 'remove-lock-button');
        basicPageVBox.append(this._lockButton._createButton());

        this._suspendButton = new CreateButton('Remove Suspend Button', 'remove-suspend-button');
        basicPageVBox.append(this._suspendButton._createButton());

        this._logoutButton = new CreateButton('Remove Logout Button', 'remove-logout-button');
        basicPageVBox.append(this._logoutButton._createButton());

        this._restartButton = new CreateButton('Remove Restart Button', 'remove-restart-button');
        basicPageVBox.append(this._restartButton._createButton());

        this._powerButton = new CreateButton('Remove Poweroff Button', 'remove-power-button');
        basicPageVBox.append(this._powerButton._createButton());

        this._settings = ExtensionUtils.getSettings();
        let logoutSettings = new Gio.Settings({schema_id: 'org.gnome.SessionManager'});
        let status = logoutSettings.get_boolean('logout-prompt');

        this._checkButton = new Gtk.CheckButton({active: status});
        this._checkButton.set_label(status ? 'Confirmation Enabled on logout, restart and power off, Safe!' : 'Oh no! no confirmation on logout, restart and poweroff, you know what it means, rite');
        this._checkButton.connect('notify::active', tickBox => {
            this._settings.set_boolean('confirmation-dialog', tickBox.active);
            this._checkButton.set_label(tickBox.active ? '60 seconds confirmation Enabled on logout, restart and power off, Safe!' : 'Oh no! no confirmation on logout, restart and poweroff, you know what it means, rite');
        });
        basicPageVBox.append(this._checkButton);

        this.notebook.append_page(basicPageGrid, new Gtk.Label({label: 'Basic Settings', visible: true, hexpand: true}));

        // End of Basic Settings Page

        // HybridSleep/Hibernate Page

        const HibernatePageGrid = createGrid();
        const HibernatePageVBox = createVBox();

        HibernatePageGrid.attach(HibernatePageVBox, 0, 0, 3, 1);

        this._hybridSleepButton = new CreateButton('Remove HybridSleep Button', 'remove-hybrid-sleep-button');
        HibernatePageVBox.append(this._hybridSleepButton._createButton());

        this._hibernationButton = new CreateButton('Remove Hibernation Button', 'remove-hibernate-button');
        HibernatePageVBox.append(this._hibernationButton._createButton());

        const labelText = '<span size="medium">' +
            'This page is useful only if you have configured HybridSleep and Hibernation yourself,\n' +
            'some useful links on this topic are ' +
            '<a href="https://ubuntuhandbook.org/index.php/2021/08/enable-hibernate-ubuntu-21-10/">Link 1</a> ' +
            '<a href="https://github.com/arelange/gnome-shell-extension-hibernate-status#hibernation-button-does-not-show-up-but-systemctl-hibernate-works">Link 2</a> ' +
            '<a href="https://support.system76.com/articles/enable-hibernation/">Link 3</a> ' +
            '<a href="https://extensions.gnome.org/extension/755/hibernate-status-button/">Source</a> ' +
            '<a href="https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/issues/28">Github Issue</a>' +
            '</span>';

        let warningLabel = new Gtk.Label({label: labelText, xalign: 0, hexpand: true, use_markup: true});
        HibernatePageVBox.append(warningLabel);

        this.notebook.append_page(HibernatePageGrid, new Gtk.Label({label: 'HybridSleep/Hibernate', visible: true, hexpand: true}));

        // End of HybridSleep/Hibernate Page
    }
}
