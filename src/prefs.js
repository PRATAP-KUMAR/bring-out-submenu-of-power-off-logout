const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

const ExtensionUtils = imports.misc.extensionUtils;

const GTK_VERSION = Gtk.get_major_version();
        let add
        GTK_VERSION == 4  ? add = 'append' : add = 'add';

function init() {
}

function buildPrefsWidget() {
    let widget = new PrefsWidget();
    		if(GTK_VERSION == 3) {
    			widget.widget.show_all(); }
    return widget.widget;
}

class PrefsWidget {
    constructor() {
        this._settings = ExtensionUtils.getSettings();

	this.widget = new Gtk.Grid({ visible: true, column_homogeneous: true });
	this.notebook = new Gtk.Notebook({ visible: true });

	this.widget.attach(this.notebook, 0, 0, 1, 1);
	
	// Basic Settings Page
	    
	let grid = new Gtk.Grid({
	column_spacing: 12, row_spacing: 12,
	column_homogeneous: true,
	hexpand: true, vexpand: true,
	margin_start: 14, margin_end: 14, margin_top: 14, margin_bottom: 14,
	visible: true
    	});

	let vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10, visible: true });

	grid.attach(vbox, 0, 0, 3, 1);
        
        	vbox[add](this.removeSuspendButton());
        	vbox[add](this.removeRestartButton());
        	vbox[add](this.removePoweroffButton());
        	vbox[add](this.removeLogoutButton());
        	
        	this.notebook.append_page(grid, new Gtk.Label({ label: 'Basic Settings', visible: true, hexpand: true }));
        
        	// End of Basic Settings Page
	    	
	    	// Arrange Button Order Page
	    	
		let grid2 = new Gtk.Grid({
        	column_spacing: 12, row_spacing: 12,
        	column_homogeneous: true,
        	hexpand: true, vexpand: true,
        	margin_start: 14, margin_end: 14, margin_top: 14, margin_bottom: 14,
        	visible: true
    		});
    
		let vbox2 = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10, visible: true });
    
    		grid2.attach(vbox2, 0, 0, 3, 1);
    
    		vbox2[add](this._arrangeButtonOrder());
    
    		this.notebook.append_page(grid2, new Gtk.Label({ label: 'Arrange Menu Items Order', visible: true, hexpand: true }));
		}
		
_arrangeButtonOrder() {
		let vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, margin_top: 5 });
		let arrangeButtonOrderLabel = new Gtk.Label({ label: "Arrange the Items Order Assuming you have All the 8 Items\n\n\
Orientation Item = 1\n\
Settings Item = 2\n\
Lock Item = 3\n\
Suspend Item = 4\n\
Switch User Item = 5\n\
Logout Item = 6\n\
Restart Item = 7\n\
Power Item =8\n\n\
for Example:\n\n\
[2, 4, 6, 8, 1, 3, 5, 7]\n\
[7, 5, 3, 1, 8, 6, 4, 2]\n\n\
numbers 9 and 10 are two reserved separators\n\
if you wish to insert separators use numbers 9 and 10 in between the numbers 1 to 8. Otherwise ignore these numbers 9 and 10\n\
you may use one separator also.\n\
Below is the default value\n\
", xalign: 0, hexpand: true });
		
		vbox[add](arrangeButtonOrderLabel);
		
		let selectableText = new Gtk.Label({ label: "[ 1, 2, 3, 9, 4, 5, 10, 6, 7, 8]\n\n\
		", xalign: 0, hexpand: true, selectable: true });
		
		vbox[add](selectableText);
		
		let inputText = new Gtk.Label({ label: "Arrange your preferred order here." });
		
		vbox[add](inputText);
	
		let orderEntry = new Gtk.Entry({ xalign: 2, hexpand: true });
		const value = this._settings.get_value('buttons-order').deepUnpack().toString();
		orderEntry.set_text('[' + value + ']');
	    
		orderEntry.connect('changed', (entry) => {
					let string = entry.get_text();
					let ARRAY_INTEGER = GLib.Variant.parse(new GLib.VariantType('ai'), string, null, null);
					this._settings.set_value('buttons-order', ARRAY_INTEGER); });
	
		vbox[add](orderEntry);
	
		return vbox;
	
    		}
		
		// End of Arrange Button Order Page
    
removeSuspendButton() {
    	let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5  });
    	let removeSuspendButtonLabel = new Gtk.Label({ label: "Remove Suspend Item", xalign: 0, hexpand: true });
    	
        this.rSBLToggleSwitch = new Gtk.Switch({ active: this._settings.get_boolean('remove-suspend-button') });
        this.rSBLToggleSwitch.connect('notify::active', (button) => { this._settings.set_boolean('remove-suspend-button', button.active); }); 
    	
    	if(GTK_VERSION == 3) {
		hbox.add(removeSuspendButtonLabel);
		hbox.add(this.rSBLToggleSwitch) }
		
        else if(GTK_VERSION == 4) {
		hbox.append(removeSuspendButtonLabel);
		hbox.append(this.rSBLToggleSwitch) }
      	
      	return hbox;
    } 
    
removeRestartButton() {
    	let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
    	let removeRestartButtonLabel = new Gtk.Label({ label: "Remove Restart Item", xalign: 0, hexpand: true });
    	
        this.rRBLToggleSwitch = new Gtk.Switch({ active: this._settings.get_boolean('remove-restart-button') });
        this.rRBLToggleSwitch.connect('notify::active', (button) => { this._settings.set_boolean('remove-restart-button', button.active); }); 
    	
    	if(GTK_VERSION == 3) {
		hbox.add(removeRestartButtonLabel);
		hbox.add(this.rRBLToggleSwitch) }
		
        else if(GTK_VERSION == 4) {
		hbox.append(removeRestartButtonLabel);
		hbox.append(this.rRBLToggleSwitch) }
      	
      	return hbox;
    } 

removePoweroffButton() {
    	let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
    	let removePoweroffButtonLabel = new Gtk.Label({ label: "Remove Poweroff Item", xalign: 0, hexpand: true });
    	
        this.rPBLToggleSwitch = new Gtk.Switch({ active: this._settings.get_boolean('remove-power-button') });
        this.rPBLToggleSwitch.connect('notify::active', (button) => { this._settings.set_boolean('remove-power-button', button.active); }); 
    	
    	if(GTK_VERSION == 3) {
		hbox.add(removePoweroffButtonLabel);
		hbox.add(this.rPBLToggleSwitch) }
		
        else if(GTK_VERSION == 4) {
		hbox.append(removePoweroffButtonLabel);
		hbox.append(this.rPBLToggleSwitch) }
      	
      	return hbox;
    }

removeLogoutButton() {
    	let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
    	let removeLogoutButtonLabel = new Gtk.Label({ label: "Remove Logout Item", xalign: 0, hexpand: true });
    	
        this.rLBLToggleSwitch = new Gtk.Switch({ active: this._settings.get_boolean('remove-logout-button') });
        this.rLBLToggleSwitch.connect('notify::active', (button) => { this._settings.set_boolean('remove-logout-button', button.active); }); 
    	
    	if(GTK_VERSION == 3) {
		hbox.add(removeLogoutButtonLabel);
		hbox.add(this.rLBLToggleSwitch) }
		
        else if(GTK_VERSION == 4) {
		hbox.append(removeLogoutButtonLabel);
		hbox.append(this.rLBLToggleSwitch) }
      	
      	return hbox;
    }
}
