import GObject from 'gi://GObject';

import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';

const LOCK = 'lock';

const SUSPEND = 'suspend';
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

const BringoutExtensionActionItem = GObject.registerClass(
    class CreateActionItem extends QuickSettingsItem {
        _init(ICON_NAME, ACCESSIBLE_NAME, ACTION) {
            super._init({
                style_class: 'icon-button',
                can_focus: true,
                track_hover: true,
                icon_name: ICON_NAME,
                accessible_name: ACCESSIBLE_NAME,
            });

            this._systemActions = SystemActions.getDefault();

            this.connect('clicked', () => {
                switch (ACTION) {
                case LOCK:
                    this._systemActions.activateLockScreen();
                    break;
                case SUSPEND:
                    this._systemActions.activateSuspend();
                    break;
                case SWITCH_USER:
                    this._systemActions.activateSwitchUser();
                    break;
                case LOGOUT:
                    this._systemActions.activateLogout();
                    break;
                case RESTART:
                    this._systemActions.activateRestart();
                    break;
                case POWEROFF:
                    this._systemActions.activatePowerOff();
                    break;
                }
                Main.panel.closeQuickSettings();
            });
        }
    });

export default BringoutExtensionActionItem;
