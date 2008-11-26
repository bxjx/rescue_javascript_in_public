module RescueJavascriptInPublicHelper
  
  # Include all the neccessary assets if the request is not local. This needs to be called from your layout
  def rescue_javascript_in_public_asset_tags
    javascript_include_tag(['scriptaculous', 'modalbox', 'rescue_javascript_in_public']) +
    stylesheet_link_tag('modalbox') if !controller.send(:local_request?)
  end

end
