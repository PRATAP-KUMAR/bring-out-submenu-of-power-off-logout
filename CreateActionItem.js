import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import ConfirmDialog from './Hibernation/confirmDialog.js';
import hybridSleepOrHibernate from './Hibernation/hibernation.js';


const BindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;

const SUSPEND = 'suspend';
//
const HYBRID_SLEEP = 'hybrid_sleep';
const HIBERNATE = 'hibernate';
//
const SWITCH_USER = 'switch_user';
const LOGOUT = 'logout';
const RESTART = 'restart';
const POWEROFF = 'poweroff';

const HybridSleepDialog = {
    subject: C_('title', 'HybridSleep'),
    description: 'Are you sure to HybridSleep the system?',
    confirmButtons: [
        {
            signal: 'cancel',
            label: C_('button', 'Cancel'),
            key: Clutter.KEY_Escape,
        },
        {
            signal: 'proceed',
            label: C_('button', 'Hybrid Sleep'),
            default: true,
        },
    ],
};

const HibernateDialog = {
    subject: C_('title', 'Hibernate'),
    description: 'Are you sure to Hibernate the system?',
    confirmButtons: [
        {
            signal: 'cancel',
            label: C_('button', 'Cancel'),
            key: Clutter.KEY_Escape,
        },
        {
            signal: 'proceed',
            label: C_('button', 'Hibernate'),
            default: true,
        },
    ],
};

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

            if (ICON_NAME.startsWith('bosm-')) {
                const extension = Extension.lookupByURL(import.meta.url);
                const dir = extension.dir;
                const iconsPath = dir.get_child('icons').get_path();
                let icon = new St.Icon({
                    gicon: Gio.icon_new_for_string(`${iconsPath}/${ICON_NAME}`),
                });
                this.set_child(icon);
            }

            const TakeAction = new SystemActions.getDefault();

            this.connect('clicked', () => {
                switch (ACTION) {
                case SUSPEND:
                    TakeAction.activateSuspend();
                    break;
                    //
                case HYBRID_SLEEP: {
                    let hybridSleep = new ConfirmDialog(HybridSleepDialog);
                    hybridSleep.connect('cancel', () => {
                        //
                    });
                    hybridSleep.connect('proceed', () => {
                        Main.notify('OK');
                        hybridSleepOrHibernate('HybridSleep');
                    });
                    hybridSleep.open();
                    break;
                }
                case HIBERNATE: {
                    let hibernate = new ConfirmDialog(HibernateDialog);
                    hibernate.connect('cancel', () => {
                        //
                    });
                    hibernate.connect('proceed', () => {
                        Main.notify('OK');
                        hybridSleepOrHibernate('Hibernate');
                    });
                    hibernate.open();
                    break;
                }
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
