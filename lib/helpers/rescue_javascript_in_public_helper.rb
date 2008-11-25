module RescueJavascriptInPublicHelper
  
  # Include all the neccessary assets. This needs to be called in your layout
  def rescue_javascript_in_public_asset_tags
    javascript_include_tag(['scriptaculous', 'modalbox', 'rescue_javascript_in_public']) +
    stylesheet_link_tag('modalbox')
  end

end
