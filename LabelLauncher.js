import GObject from 'gi://GObject';
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const LabelLauncher = new GObject.registerClass(
    class LabelLauncher extends St.Widget {
        _init(button) {
            this._button = button;
            this.label = new St.Label({style_class: 'dash-label'});
            this.label.hide();
            Main.layoutManager.addChrome(this.label);
        }

        showLabel() {
            this.label.set_text(this._button.accessible_name);
            this.label.opacity = 0;
            this.label.show();

            const center = this._button.get_transformed_position();
            const x = center[0] - 20;
            const y = 10;

            this.label.set_position(x, y);
            this.label.ease({
                opacity: 255,
                duration: 100,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            });
        }

        hideLabel() {
            this.label.ease({
                opacity: 0,
                duration: 500,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                onComplete: () => this.label.hide(),
            });
        }
    }
);

export default LabelLauncher;
