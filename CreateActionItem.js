import GObject from 'gi://GObject';
import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';

const BindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;

const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

const CreateActionItem = GObject.registerClass(
    class CreateActionItem extends QuickSettingsItem {
        _init(ICON_NAME, ACCESSIBLE_NAME, ACTION, BINDING_ID) {
            super._init({
                style_class: 'icon-button',
                can_focus: true,
                track_hover: true,
                icon_name: ICON_NAME,
                accessible_name: ACCESSIBLE_NAME,
            });

            const TakeAction = new SystemActions.getDefault();

            this.connect('clicked', () => {
                switch (ACTION) {
                case SUSPEND:
                    TakeAction.activateSuspend();
                    break;
                case SWITCH_USER:
                    TakeAction.activateSwitchUser();
                    break;
                case LOGOUT:
                    TakeAction.activateLogout();
                    break;
                case RESTART:
                    TakeAction.activateRestart();
                    break;
                case POWEROFF:
                    TakeAction.activatePowerOff();
                    break;
                }

                Main.panel.closeQuickSettings();
            });

            if (BINDING_ID)
                TakeAction.bind_property(BINDING_ID, this, 'visible', BindFlags);
        }
    }
);

export default CreateActionItem;
