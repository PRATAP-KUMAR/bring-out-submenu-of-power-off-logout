#!/bin/bash

NAME=BringOutSubmenuOfPowerOffLogoutButton
DOMAIN=pratap.fastmail.fm
UUID=$NAME@$DOMAIN
ZIP_NAME=$UUID.zip

JS_FILES=$(find -type f -and \( -name '*.js' \) ! -path '*/node_modules/*')

create_zip() {
	echo Creating zip file ...
	zip -r $ZIP_NAME $JS_FILES \
		schemas/org.gnome.shell.extensions.bring-out-submenu-of-power-off-logout.gschema.xml \
		metadata.json \
		stylesheet.css \
		locale/*
	echo $ZIP_NAME file is created.
}

if [[ -z $1 ]]; then
	echo "Please provide the options --install or --uninstall ex. ./script.sh --install or ./script.sh --uninstall"
	exit 1
fi

case $1 in
--install)
	create_zip
	gnome-extensions install -f $ZIP_NAME
	;;
--uninstall)
	gnome-extensions uninstall $UUID
	;;
*)
	echo "Please provide the options --install or --uninstall ex. ./script.sh --install or ./script.sh --uninstall"
	exit 1
	;;
esac

if [[ -e $ZIP_NAME ]]; then
	rm $ZIP_NAME
	echo $ZIP_NAME file is removed.
fi
