class RescueJavascriptInPublicController < ApplicationController

  def index
    raise RescueJavascriptInPublic::JavascriptError.new(params)
  end

end
