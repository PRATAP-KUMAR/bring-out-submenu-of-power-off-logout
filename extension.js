import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import CreateItem from './CreateItem.js';
// import St from 'gi://St';
// import { QuickSettingsItem } from 'resource:///org/gnome/shell/ui/quickSettings.js';
// import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';
// import GObject from 'gi://GObject';

let items = []
// let keys = []

const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

// const CreateItem = GObject.registerClass(
//     class CreateItem extends QuickSettingsItem {
//         _init(ICON_NAME, ACCESSIBLE_NAME, ACTION, KEY = null, BINDING_ID = null) {
//             super._init({
//                 style_class: 'icon-button',
//                 can_focus: true,
//                 track_hover: true,
//                 child: new St.Icon({ icon_name: ICON_NAME }),
//                 accessible_name: ACCESSIBLE_NAME,
//             });

//             const TakeAction = new SystemActions.getDefault();

//             this.connect('clicked', () => {
//                 switch (ACTION) {
//                     case SUSPEND:
//                         TakeAction.activateSuspend();
//                         break;
//                     case SWITCH_USER:
//                         TakeAction.activateSwitchUser();
//                         break;
//                     case LOGOUT:
//                         TakeAction.activateLogout();
//                         break;
//                     case RESTART:
//                         TakeAction.activateRestart();
//                         break;
//                     case POWEROFF:
//                         TakeAction.activatePowerOff();
//                         break;
//                 }

//                 Main.panel.closeQuickSettings();
//             });

//             if (BINDING_ID)
//                 TakeAction.bind_property(BINDING_ID, this, 'visible', BindFlags);

//             items.push(this);
//             keys.push(KEY);
//         }
//     }
// );

export default class ExampleExtension extends Extension {

    _init() {
        this._actionItems = null;
        this._powerOffMenuItem = null;
    }

    _createMenu() {
        items = [];

        let suspendItem = new CreateItem('media-playback-pause-symbolic', 'Suspend', SUSPEND, 'remove-suspend-button', 'can-suspend');
        items.push(suspendItem);

        this._switchUserItem = new CreateItem('system-switch-user-symbolic', 'Switch User���', SWITCH_USER, null, 'can-switch-user');
        items.push(this._switchUserItem);

        this._logoutItem = new CreateItem('system-log-out-symbolic', 'Log Out���', LOGOUT, 'remove-logout-button', 'can-logout');
        items.push(this._logoutItem);

        this._restartItem = new CreateItem('system-reboot-symbolic', 'Restart���', RESTART, 'remove-restart-button', 'can-restart');
        items.push(this._restartItem);

        this._powerItem = new CreateItem('system-shutdown-symbolic', 'Power Off���', POWEROFF, 'remove-power-button', 'can-power-off');
        items.push(this._powerItem);

        items.forEach((item) => {
            this._actionItems.add(item);
        });
    }

    _modifySystemItem() {
        this._actionItems = Main.panel.statusArea.quickSettings._system._systemItem.child;
        this._powerOffMenuItem = this._actionItems.get_child_at_index(6);
        this._actionItems.remove_child(this._powerOffMenuItem);
        this._createMenu();
    }

    _queueModifySystemItem() {
        GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            if (!Main.panel.statusArea.quickSettings._system)
                return GLib.SOURCE_CONTINUE;

            this._modifySystemItem();
            return GLib.SOURCE_REMOVE;
        });
    }

    enable() {
        if (Main.panel.statusArea.quickSettings._system)
            this._modifySystemItem();
        else
            this._queueModifySystemItem();
    }

    disable() {
        items.forEach((item) => {
            this._actionItems.remove_child(item);
        });
        this._actionItems.add_child(this._powerOffMenuItem);
    }
}