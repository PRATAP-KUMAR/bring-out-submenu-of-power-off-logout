# Bring Out Submenu of Power Off Button

## Action Buttons

The default  
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/a4635666-dded-4325-902f-1e7b61019780)

With this Extension  
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/a395f347-f1eb-441c-970d-ed09718f2bf2)

Tooltip - Do not show by default - You can turn on and off via extension settings  
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/4af3c901-247b-4382-bb9c-17e77e7e0ecd)

You can customize the tooltip styling via extension's `stylesheet.css` file, example code

```
.brng-out-ext-tooltip {
    font-weight: bold;
    background-color: red;
    color: black;
}
```

![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/df10b360-92cf-49cd-879c-eb190319ad82)

You can hide individual buttons starting from lock-screen to shutdown via extension settings except switch-user
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/683f0588-c04b-4a06-b2a2-3c5ca8dd300b)

switch-user https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/issues/32

## Install
### Option 1
from extensions.gnome.org <a href="https://extensions.gnome.org/extension/2917/bring-out-submenu-of-power-offlogout-button/">Official</a>

### Option 2
Install latest version from github
1. `git clone https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout.git`
2. `cd bring-out-submenu-of-power-off-logout`
3. `make`
4. `make install`

## Optional - Hibernation Buttons
You can optionally choose to show HybridSleep and Hibernation buttons if HybridSleep and Hibernation work in your system.

some useful links on this topic are
    <a href="https://ubuntuhandbook.org/index.php/2021/08/enable-hibernate-ubuntu-21-10/">Link 1</a>
    <a href="https://github.com/arelange/gnome-shell-extension-hibernate-status#hibernation-button-does-not-show-up-but-systemctl-hibernate-works">Link 2</a>
    <a href="https://support.system76.com/articles/enable-hibernation/">Link 3</a>
    <a href="https://extensions.gnome.org/extension/755/hibernate-status-button/">Source</a>
    <a href="https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/issues/28">Github Issue</a>

If you choose to show the buttons, you can customize the icons. you have to keep svg icons of your choice
with the names **hybrid-sleep-symbolic.svg** and **hibernate-symbolic.svg** into `.icons` folder of your home directory.

![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/32dc8d98-64d0-4f3e-ad48-b0bdc4fc95b4)

<hr/>

<a href="https://www.buymeacoffee.com/pratappanabaka"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=pratappanabaka&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
