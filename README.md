# Bring Out the Submenu of the Power Off Button

## Readme for gnome-shell v45 and v46

### extension v56 Sun Jun 16th 2024

1. Removed bindings with the system dconf settings such as disable-lock-screen, disable-user-switching, and disable-logout.
2. So that all buttons will stick to extension settings.
3. Added modal to inform user, if any key is locked.

## Action Buttons

The default  
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/a4635666-dded-4325-902f-1e7b61019780)

With this Extension  
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/a395f347-f1eb-441c-970d-ed09718f2bf2)

Tooltip - show by default - You can turn it off and on via extension settings  
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/4af3c901-247b-4382-bb9c-17e77e7e0ecd)

You can customize the tooltip styling via the extension's `stylesheet.css` file, for example code

```
.brng-out-ext-tooltip {
    font-weight: bold;
    background-color: red;
    color: black;
}
```

![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/df10b360-92cf-49cd-879c-eb190319ad82)

You can hide individual buttons starting from lock-screen to shutdown via extension settings
![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/683f0588-c04b-4a06-b2a2-3c5ca8dd300b)

## Install

from extensions.gnome.org <a href="https://extensions.gnome.org/extension/2917/bring-out-submenu-of-power-offlogout-button/">Gnome Extensions</a>

## Optional - Hibernation Buttons

You can optionally choose to show HybridSleep and Hibernation buttons if HybridSleep and Hibernation work in your system.

some useful links on this topic are
<a href="https://ubuntuhandbook.org/index.php/2021/08/enable-hibernate-ubuntu-21-10/">Ubuntu Hand Book</a>
<a href="https://github.com/arelange/gnome-shell-extension-hibernate-status#hibernation-button-does-not-show-up-but-systemctl-hibernate-works">Github</a>
<a href="https://support.system76.com/articles/enable-hibernation/">System 76</a>
<a href="https://extensions.gnome.org/extension/755/hibernate-status-button/">Source</a>
<a href="https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/issues/28">Github Issue</a>

If you choose to show the buttons, you can customize the icons. you have to keep svg icons of your choice
with the names **hybrid-sleep-symbolic.svg** and **hibernate-symbolic.svg** into `.icons` folder of your home directory.

![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/32dc8d98-64d0-4f3e-ad48-b0bdc4fc95b4)

## Other Language Support

French Language is supported. Once you have installed the extension,
then copy the folder `locale` from this repo and paste in the root directory of the extension.

```
$HOME/.local/share/gnome-shell/extensions/BringOutSubmenuOfPowerOffLogoutButton@pratap.fastmail.fm
```

![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/d5be0cc6-f22b-4dbc-9308-9efc14762237)

![image](https://github.com/PRATAP-KUMAR/bring-out-submenu-of-power-off-logout/assets/40719899/46798d46-dcb5-4b27-8d58-a10daac7222e)

<hr/>

<a href="https://www.buymeacoffee.com/pratappanabaka"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=pratappanabaka&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" /></a>
