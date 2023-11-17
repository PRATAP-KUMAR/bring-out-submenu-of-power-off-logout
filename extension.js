import {Extension, gettext, pgettext} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import BringoutMenu from './BringoutMenu.js';

let modifiedMenu;
let sourceId = null;

export default class BringoutExtension extends Extension {
    _modifySystemItem() {
        modifiedMenu = new BringoutMenu(
            this._settings,
            this._gettext,
            this._pgettext
        );
    }

    _queueModifySystemItem() {
        sourceId = GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            if (!Main.panel.statusArea.quickSettings._system)
                return GLib.SOURCE_CONTINUE;

            this._modifySystemItem();
            return GLib.SOURCE_REMOVE;
        });
    }

    enable() {
        this._settings = this.getSettings();
        this._gettext = gettext;
        this._pgettext = pgettext;

        if (Main.panel.statusArea.quickSettings._system)
            this._modifySystemItem();
        else
            this._queueModifySystemItem();
    }

    disable() {
        modifiedMenu._destroy();
        modifiedMenu = null;
        if (sourceId) {
            GLib.Source.remove(sourceId);
            sourceId = null;
        }
        this._pgettext = null;
        this._gettext = null;
        this._settings = null;
    }
}
