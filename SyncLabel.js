import GObject from 'gi://GObject';
import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import LabelLauncher from './LabelLauncher.js';
import GLib from 'gi://GLib';

const SyncLabel = GObject.registerClass(
    class SyncLabel extends QuickSettingsItem {
        _init(button) {
            this._button = button;
            this._button._showLabelTimeoutId = 0;
            this._button._resetHoverTimeoutId = 0;
            this._button._labelShowing = false;
            this._toolTip = new LabelLauncher(this._button);
            this._toolTip.child = this._button;
        }

        _syncLabel() {
            if (this._toolTip.child.hover) {
                if (this._button._showLabelTimeoutId === 0) {
                    const timeout = this._button._labelShowing ? 0 : 100;
                    this._button._showLabelTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout,
                        () => {
                            this._button._labelShowing = true;
                            this._toolTip.showLabel();
                            this._button._showLabelTimeoutId = 0;
                            return GLib.SOURCE_REMOVE;
                        });
                    GLib.Source.set_name_by_id(this._showLabelTimeoutId, '[gnome-shell] this.toolTip.showLabel');
                    if (this._button._resetHoverTimeoutId > 0) {
                        GLib.source_remove(this._button._resetHoverTimeoutId);
                        this._button._resetHoverTimeoutId = 0;
                    }
                }
            } else {
                if (this._button._showLabelTimeoutId > 0)
                    GLib.source_remove(this._button._showLabelTimeoutId);
                this._button._showLabelTimeoutId = 0;
                this._toolTip.hideLabel();
                if (this._button._labelShowing) {
                    this._button._resetHoverTimeoutId = GLib.timeout_add(
                        GLib.PRIORITY_DEFAULT, 100,
                        () => {
                            this._button._labelShowing = false;
                            this._button._resetHoverTimeoutId = 0;
                            return GLib.SOURCE_REMOVE;
                        }
                    );
                    GLib.Source.set_name_by_id(this._button._resetHoverTimeoutId, '[gnome-shell] this.toolTip.hideLabel');
                }
            }
        }

        _destroy() {
            if (this._button._showLabelTimeoutId) {
                GLib.source_remove(this._button._showLabelTimeoutId);
                this._button._showLabelTimeoutId = null;
            }

            if (this._button._resetHoverTimeoutId) {
                GLib.source_remove(this._button._resetHoverTimeoutId);
                this._button._resetHoverTimeoutId = null;
            }
        }
    }
);

export default SyncLabel;
