import GObject from 'gi://GObject';
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const LabelLauncher = new GObject.registerClass(
    class LabelLauncher extends St.Widget {
        _init(button) {
            this._button = button;
            this.label = new St.Label({style_class: 'dash-label brng-out-ext-tooltip'});
            this.label.hide();
            Main.layoutManager.addChrome(this.label);
        }

        showLabel() {
            this.label.set_text(this._button.accessible_name);
            let width = this.label.width;
            let height = this.label.height;

            let centerX = this._button.get_transformed_extents().get_center().x;

            const x = centerX - width / 2;
            const y = Main.panel.statusArea.quickSettings.menu.box.get_transformed_position()[1] - height;

            this.label.set_position(x, y);
            this.label.show();

            this.label.opacity = 0;
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

        _destroy() {
            Main.layoutManager.removeChrome(this.label);
            this.label = null;
        }
    }
);

export default LabelLauncher;
