# Re_Arrange_System_Menu_Items
Bring Out Submenu Of Power Off/Logout Item and merge with System Menu.

This extension removes the Power Off/Logout submenu and merges with system menu. Rearranges the order of System Menu.

This branch is created keeping the user reviews [https://extensions.gnome.org/extension/2917/bring-out-submenu-of-power-offlogout-button/](https://extensions.gnome.org/extension/2917/bring-out-submenu-of-power-offlogout-button/) in mind.

User Review Points..

by x-plo  
Problem with tweak system menu extension (just made it disappear)

by oshikuru  
great, but any chance of an option to hide the suspend entry? i keep accidently hitting it

---------------------------------------------------------------------------------------------------------------

you must compile the schemas to use the options. To do so,
1. copy the file `org.gnome.shell.extensions.brngout.gschema.xml` which is inside schemas directory to `$HOME/.local/share/glib-2.0/schemas/` Create the Directorys as Necessary.
2. and run the command `glib-compile-schemas .` from the directory `$HOME/.local/share/glib-2.0/schemas/`

![Image](https://i.stack.imgur.com/yWtPV.png)

![Image](https://i.stack.imgur.com/Q7YK7.gif)

Extension Icon Used in gnome-extensions.org site is the credit of [this website.](https://materialdesignicons.com/) [LICENSE](https://github.com/google/material-design-icons/blob/master/LICENSE)


