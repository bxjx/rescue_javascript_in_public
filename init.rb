ActiveSupport::Dependencies.load_paths << File.join(File.dirname(__FILE__), 'lib', 'controllers')
ActiveSupport::Dependencies.load_paths << File.join(File.dirname(__FILE__), 'lib', 'helpers')

ActionController::Base.helper RescueJavascriptInPublicHelper

