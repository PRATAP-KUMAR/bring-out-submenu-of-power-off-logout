SHELL := /bin/bash

# Replace these with the name and domain of your extension!
NAME     := bring-out-submenu-of-power-off-logout
DOMAIN   := pratap.fastmail.fm
UUID	 := $(NAME)@$(DOMAIN)
ZIP_NAME := $(UUID).zip

# Some of the recipes below depend on some of these files.
JS_FILES       = $(shell find -type f -and \( -name "*.js" \))
ICONS          = $(shell find -maxdepth 2 -type f -and \( -name "*.svg" \))

# These files will be included in the extension zip file.
ZIP_CONTENT = $(JS_FILES) $(ICONS) \
              schemas/* schemas/gschemas.compiled metadata.json

# These five recipes can be invoked by the user.
.PHONY: all zip install uninstall clean

all: $(ZIP_CONTENT)

# The zip recipes only bundles the extension without installing it.
zip: $(ZIP_NAME)

# The install recipes creates the extension zip and installs it.
install: $(ZIP_NAME)
	gnome-extensions install "$(ZIP_NAME)" --force
	@echo "Extension installed successfully! Now restart the Shell ('Alt'+'F2', then 'r' or log out/log in on Wayland)."

# This uninstalls the previously installed extension.
uninstall:
	gnome-extensions uninstall "$(UUID)"

# This removes all temporary files created with the other recipes.
clean:
	rm -rf $(ZIP_NAME) \
	       schemas/gschemas.compiled

# This bundles the extension and checks whether it is small enough to be uploaded to
# extensions.gnome.org. We do not use "gnome-extensions pack" for this, as this is not
# readily available on the GitHub runners.
$(ZIP_NAME): $(ZIP_CONTENT)
	@echo "Packing zip file..."
	@rm --force $(ZIP_NAME)
	@zip $(ZIP_NAME) -- $(ZIP_CONTENT)

	@#Check if the zip size is too big to be uploaded
	@SIZE=$$(unzip -Zt $(ZIP_NAME) | awk '{print $$3}') ; \
	 if [[ $$SIZE -gt 5242880 ]]; then \
	    echo "ERROR! The extension is too big to be uploaded to" \
	         "the extensions website, keep it smaller than 5 MB!"; \
	    exit 1; \
	 fi

# Compiles the gschemas.compiled file from the gschema.xml file.
schemas/gschemas.compiled: schemas/org.gnome.shell.extensions.$(NAME).gschema.xml
	@echo "Compiling schemas..."
	@glib-compile-schemas schemas