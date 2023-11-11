import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import {getLoginManager} from 'resource:///org/gnome/shell/misc/loginManager.js';

/**
 *
 * @param {string} input - HybridSleep/Hibernate
 */
function hybridSleepOrHibernate(input) {
    const LoginManager = getLoginManager();
    if (LoginManager._proxy)
        LoginManager._proxy.call(input, GLib.Variant.new('(b)', [true]), Gio.DBusCallFlags.NONE, -1, null, null);
}

export default hybridSleepOrHibernate;
