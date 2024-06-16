import GObject from 'gi://GObject';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';

import { QuickSettingsItem } from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import CreateActionItem from './CreateActionItem.js';
import SyncLabel from './SyncLabel.js';

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

let actionButtons;

const BringoutMenu = new GObject.registerClass(
    class BringoutMenu extends QuickSettingsItem {
        _init(settings, gettext, pgettext) {
            this._settings = settings;
            this._gettext = gettext;
            this._pgettext = pgettext;

            // this._lockDownSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.lockdown' });

            this._systemItem = Main.panel.statusArea.quickSettings._system._systemItem;

            this._containerRow = this._systemItem.child;

            this.lockItem = this._containerRow.get_child_at_index(5);
            this.powerOffMenuItem = this._containerRow.get_child_at_index(6);

            this._containerRow.remove_child(this.lockItem);
            this._containerRow.remove_child(this.powerOffMenuItem);

            this._createMenu();
            this._connectSettings();
            this._toolTip();
        }

        _createDialogs() {
            const _ = this._gettext;
            const pgettext = this._pgettext;

            this._hybridSleepDialog = {
                subject: pgettext('title', 'Hybrid Sleep'),
                description: _('Are you sure to Hybrid Sleep the system?'),
                confirmButtons: [
                    {
                        signal: 'cancel',
                        label: pgettext('button', 'Cancel'),
                        key: Clutter.KEY_Escape,
                    },
                    {
                        signal: 'proceed',
                        label: pgettext('button', 'Hybrid Sleep'),
                        default: true,
                    },
                ],
            };

            this._hibernateDialog = {
                subject: pgettext('title', 'Hibernate'),
                description: _('Are you sure to Hibernate the system?'),
                confirmButtons: [
                    {
                        signal: 'cancel',
                        label: pgettext('button', 'Cancel'),
                        key: Clutter.KEY_Escape,
                    },
                    {
                        signal: 'proceed',
                        label: pgettext('button', 'Hibernate'),
                        default: true,
                    },
                ],
            };

            this._lockDialog = {
                subject: pgettext('title', 'Lock Screen'),
                description: _('Oops! lock screen is disabled'),
                confirmButtons: [
                    {
                        signal: 'cancel',
                        label: pgettext('button', 'Cancel'),
                        key: Clutter.KEY_Escape,
                    }
                ],
            };

            this._switchUserDialog = {
                subject: pgettext('title', 'Switch User'),
                description: _('Oops! user switching is disabled'),
                confirmButtons: [
                    {
                        signal: 'cancel',
                        label: pgettext('button', 'Cancel'),
                        key: Clutter.KEY_Escape,
                    }
                ]
            }
            this._logoutDialog = {
                subject: pgettext('title', 'Logout'),
                description: _('Oops Logout is disabled, this means Logout, restart and poweroff are disabled'),
                confirmButtons: [
                    {
                        signal: 'cancel',
                        label: pgettext('button', 'Cancel'),
                        key: Clutter.KEY_Escape,
                    }
                ]
            }
            this._restartDialog = {
                subject: pgettext('title', 'Restart'),
                description: _('Oops Logout is disabled, this means Logout, restart and poweroff are disabled'),
                confirmButtons: [
                    {
                        signal: 'cancel',
                        label: pgettext('button', 'Cancel'),
                        key: Clutter.KEY_Escape,
                    }
                ]
            }
            this._powerOffDialog = {
                subject: pgettext('title', 'Power Off'),
                description: _('Oops Logout is disabled, this means Logout, restart and poweroff are disabled'),
                confirmButtons: [
                    {
                        signal: 'cancel',
                        label: pgettext('button', 'Cancel'),
                        key: Clutter.KEY_Escape,
                    }
                ]
            }
        }

        _createMenu() {
            this._customButtons = [];
            this._keys = [];
            this._instancesOfSyncLabels = [];
            this._instancesOfLabelLaunchers = [];

            const _ = this._gettext;

            this._createDialogs();

            this._lockItem = new CreateActionItem('system-lock-screen-symbolic', _('Lock Screen'), LOCK, this._lockDialog);
            this._suspendItem = new CreateActionItem('media-playback-pause-symbolic', _('Suspend'), SUSPEND, null, null);

            // Hibernation
            this._hybridSleepItem = new CreateActionItem('hybrid-sleep-symbolic', _('Hybrid Sleep'), HYBRID_SLEEP, this._hybridSleepDialog, null);
            this._hybridSleepItem.child.set_fallback_icon_name('gnome-disks-state-standby-symbolic');

            this._hibernateItem = new CreateActionItem('hibernate-symbolic', _('Hibernate'), HIBERNATE, this._hibernateDialog, null);
            this._hibernateItem.child.set_fallback_icon_name('document-save-symbolic');
            //
            this._switchUserItem = new CreateActionItem('system-switch-user-symbolic', _('Switch User'), SWITCH_USER, this._switchUserDialog);
            this._logoutItem = new CreateActionItem('system-log-out-symbolic', _('Log Out'), LOGOUT, this._logoutDialog);
            this._restartItem = new CreateActionItem('system-reboot-symbolic', _('Restart'), RESTART, this._restartDialog);
            this._powerItem = new CreateActionItem('system-shutdown-symbolic', _('Power Off'), POWEROFF, this._powerOffDialog);

            this._customButtons = [
                this._lockItem,
                this._suspendItem,
                this._hybridSleepItem,
                this._hibernateItem,
                this._switchUserItem,
                this._logoutItem,
                this._restartItem,
                this._powerItem,
            ];

            this._keys = [
                'hide-lock-button',
                'hide-suspend-button',
                'hide-hybrid-sleep-button',
                'hide-hibernate-button',
                'hide-switch-user-button',
                'hide-logout-button',
                'hide-restart-button',
                'hide-power-button',
            ];

            this._customButtons.forEach(button => this._containerRow.add_child(button));

            this._customButtons.forEach((button, idx) => {
                let key = this._keys[idx];
                if (key)
                    this._settingsChanged(button, key);
            });
        }

        _connectSettings() {
            this._customButtons.forEach((button, idx) => {
                let key = this._keys[idx];
                if (key) {
                    // settings id to destroy - Ref 1
                    button._settingsId = this._settings.connect(`changed::${key}`, this._settingsChanged.bind(this, button, key));
                }
            });

            // id to destory - Ref 2
            this._tooltipId = this._settings.connect('changed::show-tooltip', this._toolTip.bind(this));
        }

        _toolTip() {
            actionButtons = this._containerRow.get_children();
            actionButtons.forEach(button => {
                let shouldShowToolTip = this._settings.get_boolean('show-tooltip');
                if (shouldShowToolTip) {
                    if (button.accessible_name) {
                        const callSync = new SyncLabel(button);

                        // stack instances of SyncLabel to use in _destroy() - Ref 3
                        this._instancesOfSyncLabels.push(callSync);

                        // stack St label widget from Line 12 of LabelLauncher.js to remove in _destroy() - Ref 4
                        this._instancesOfLabelLaunchers.push(callSync._toolTip);

                        // button handler id's to destroy - Ref 5
                        button._handlerId = button.connect('notify::hover', () => {
                            callSync._syncLabel();
                        });
                    }
                } else {
                    this._destroyTooltips();
                }
            });
        }

        _settingsChanged(button, key) {

            let shallHideButton = this._settings.get_boolean(key);

            if (shallHideButton) {
                button.hide();
            } else {
                button.show();
            }
        }

        _destroyTooltips() {
            // Ref 3
            this._instancesOfSyncLabels.forEach(instance => {
                instance._destroy();
            });

            // Ref 4
            this._instancesOfLabelLaunchers.forEach(instance => {
                instance._destroy();
            });

            // Ref 5
            actionButtons.forEach(button => {
                if (button._handlerId)
                    button.disconnect(button._handlerId);
            });

            this._instancesOfSyncLabels = [];
            this._instancesOfLabelLaunchers = [];
        }

        _destroy() {
            // Ref 1
            this._customButtons.forEach(button => {
                if (button._settingsId)
                    this._settings.disconnect(button._settingsId);
            });

            // Ref 2
            if (this._toolTipId)
                this._settings.disconnect(this._toolTipId);

            // Ref 3, 4, 5
            this._destroyTooltips();

            this._customButtons.forEach(button => {
                this._containerRow.remove_child(button);
                button.destroy();
                button = null;
            });

            this._customButtons = [];
            this._keys = [];

            this._hybridSleepDialog = null;
            this._hibernationDialog = null;

            this._containerRow.add_child(this.lockItem);
            this._containerRow.add_child(this.powerOffMenuItem);
        }
    }
);

export default BringoutMenu;
