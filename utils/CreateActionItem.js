import GObject from 'gi://GObject';

import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';

import ConfirmDialog from './ConfirmDialog.js';
import hybridSleepOrHibernate from '../hibernation/hybridSleepOrHibernate.js';

const LOCK = 'lock';
const SUSPEND = 'suspend';

// Hibernation
const HYBRID_SLEEP = 'hybrid_sleep';
const HIBERNATE = 'hibernate';
//

const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

const CreateActionItem = GObject.registerClass(
    class CreateActionItem extends QuickSettingsItem {
        _init(ICON_NAME, ACCESSIBLE_NAME, ACTION, DIALOG, lockDownSettings, userManager = null) {
            super._init({
                style_class: 'icon-button',
                can_focus: true,
                track_hover: true,
                icon_name: ICON_NAME,
                accessible_name: ACCESSIBLE_NAME,
            });

            const TakeAction = SystemActions.getDefault();

            this.connect('clicked', () => {
                switch (ACTION) {
                case LOCK: {
                    let boolean = lockDownSettings.get_boolean('disable-lock-screen');
                    if (boolean) {
                        let lockInformation = new ConfirmDialog(DIALOG);
                        lockInformation.open();
                    } else {
                        TakeAction.activateLockScreen();
                    }
                    break;
                }
                case SUSPEND:
                    TakeAction.activateSuspend();
                    break;
                    // Hibernation
                case HYBRID_SLEEP: {
                    let hybridSleep = new ConfirmDialog(DIALOG);
                    hybridSleep.connect('proceed', () => {
                        hybridSleepOrHibernate('HybridSleep');
                    });
                    hybridSleep.open();
                    break;
                }
                case HIBERNATE: {
                    let hibernate = new ConfirmDialog(DIALOG);
                    hibernate.connect('proceed', () => {
                        hybridSleepOrHibernate('Hibernate');
                    });
                    hibernate.open();
                    break;
                }
                //
                case SWITCH_USER: {
                    if (!userManager.has_multiple_users) {
                        Main.notify('Opps!', 'There are no multiple users');
                    } else {
                        let boolean = lockDownSettings.get_boolean('disable-user-switching');
                        if (boolean) {
                            let switchUserInformation = new ConfirmDialog(DIALOG);
                            switchUserInformation.open();
                        } else {
                            TakeAction.activateSwitchUser();
                        }
                    }
                    break;
                }

                case LOGOUT: {
                    let boolean = lockDownSettings.get_boolean('disable-log-out');
                    if (boolean) {
                        let logoutInformation = new ConfirmDialog(DIALOG);
                        logoutInformation.open();
                    } else {
                        TakeAction.activateLogout();
                    }
                    break;
                }
                case RESTART: {
                    let boolean = lockDownSettings.get_boolean('disable-log-out');
                    if (boolean) {
                        let restartInformation = new ConfirmDialog(DIALOG);
                        restartInformation.open();
                    } else {
                        TakeAction.activateRestart();
                    }
                    break;
                }
                case POWEROFF: {
                    let boolean = lockDownSettings.get_boolean('disable-log-out');
                    if (boolean) {
                        let powerOffInformation = new ConfirmDialog(DIALOG);
                        powerOffInformation.open();
                    } else {
                        TakeAction.activatePowerOff();
                    }
                    break;
                }
                }

                Main.panel.closeQuickSettings();
            });
        }
    }
);

export default CreateActionItem;
