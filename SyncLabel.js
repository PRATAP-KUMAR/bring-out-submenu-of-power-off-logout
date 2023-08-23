import GObject from 'gi://GObject';
import {QuickSettingsItem} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import LabelLauncher from './LabelLauncher.js';
import GLib from 'gi://GLib';

const SyncLabel = GObject.registerClass(
    class SyncLabel extends QuickSettingsItem {
        _init(item) {
            this.item = item;
            this.item._showLabelTimeoutId = 0;
            this.item._resetHoverTimeoutId = 0;
            this.item._labelShowing = false;
            this.toolTip = new LabelLauncher();
            this.toolTip.child = this.item;
        }

        _syncLabel() {
            if (this.toolTip.child.hover) {
                if (this.item._showLabelTimeoutId === 0) {
                    const timeout = this.item._labelShowing ? 0 : 100;
                    this.item._showLabelTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout,
                        () => {
                            this.item._labelShowing = true;
                            this.toolTip.showLabel(this.item);
                            this.item._showLabelTimeoutId = 0;
                            return GLib.SOURCE_REMOVE;
                        });
                    GLib.Source.set_name_by_id(this._showLabelTimeoutId, '[gnome-shell this.toolTip.showLabel');
                    if (this.item._resetHoverTimeoutId > 0) {
                        GLib.source_remove(this.item._resetHoverTimeoutId);
                        this.item._resetHoverTimeoutId = 0;
                    }
                }
            } else {
                if (this.item._showLabelTimeoutId > 0)
                    GLib.source_remove(this.item._showLabelTimeoutId);
                this.item._showLabelTimeoutId = 0;
                this.toolTip.hideLabel();
                if (this.item._labelShowing) {
                    this.item._resetHoverTimeoutId = GLib.timeout_add(
                        GLib.PRIORITY_DEFAULT, 100,
                        () => {
                            this.item._labelShowing = false;
                            this.item._resetHoverTimeoutId = 0;
                            return GLib.SOURCE_REMOVE;
                        }
                    );
                    GLib.Source.set_name_by_id(this.item._resetHoverTimeoutId, '[gnome-shell] this.item._labelShowing');
                }
            }
        }
    }
);

export default SyncLabel;
