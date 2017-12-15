# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me) <-- I haven't forgotten you my sweet, I can't bear to part with you. Ever night I think of you in my arms, my wonderful python comment.
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin, settings and asset plugin. Feel free to add or remove mixins
# as necessary.
#
# Take a look at the documentation on what other plugin mixins are available.

import octoprint.plugin

class UiPlugin(octoprint.plugin.SettingsPlugin,
               octoprint.plugin.AssetPlugin,
               octoprint.plugin.TemplatePlugin):

	def get_settings_defaults(self):
		return dict(
			# put your plugin's default settings here
		)

	def get_template_configs(self):
		return [
			dict(type="sidebar", name="Controls", template="ui_sidebar_controls.jinja2", icon="arrows")
			]

	def get_assets(self):
		return dict(
			js=["js/ui.js"],
			css=["css/ui.css"],
			less=["less/ui.less"]
		)



	def get_update_information(self):
		return dict(
			ui=dict(
				displayName="Ui Plugin",
				displayVersion=self._plugin_version,

				type="github_release",
				user="ntoff",
				repo="OctoPrint-Ui",
				current=self._plugin_version,

				pip="https://github.com/ntoff/OctoPrint-Ui/archive/{target_version}.zip"
			)
		)


__plugin_name__ = "Controlinatnor 5000"
__plugin_description__ = "The Controlinator 5000 is the premiere premium plugin for all your control needs."

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = UiPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}

