class RescueJavascriptInPublicController < ApplicationController

  # Takes the passed error information and raises a custom exception
  def index
    raise RescueJavascriptInPublic::JavascriptError.new(params[:exception], params.symbolize_keys) 
  end

end
