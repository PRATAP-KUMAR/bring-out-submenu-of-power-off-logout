import {ExtensionPreferences, gettext} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import GeneralPage from './prefs/generalPage.js';
import HibernationPage from './prefs/hibernationPage.js';

export default class BringoutExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window.add(new GeneralPage(this.getSettings(), gettext));
        window.add(new HibernationPage(this.getSettings(), gettext));
    }
}
