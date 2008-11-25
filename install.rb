def copy_assets(assets, dir)
  assets.each do |asset|
    dest_file = File.join(RAILS_ROOT, "public", dir, File.basename(asset))
    src_file = File.join(File.dirname(__FILE__) , 'assets', asset)
    if File.exists?(dest_file)
      puts "#{dest_file} exists... skipping"
    else
      FileUtils.cp(src_file, dest_file) if dest_file
      puts "#{dest_file} installed"
    end
  end
end

puts "Installing asset files..."
copy_assets(['lib/modalbox1.6.0/lib/scriptaculous.js', 'lib/modalbox1.6.0/modalbox.js', 'src/rescue_javascript_in_public.js'], 'javascripts')
copy_assets(['lib/modalbox1.6.0/modalbox.css'], 'stylesheets')
copy_assets(['lib/modalbox1.6.0/spinner.gif'], 'images')
puts "Files copied - install complete!"
puts "You must now update your config/routes.rb and add the entry:"
puts "map.connect 'rescue_javascript_in_public', {:controller => 'rescue_javascript_in_public'}"
