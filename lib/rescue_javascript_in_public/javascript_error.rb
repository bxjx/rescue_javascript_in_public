module RescueJavascriptInPublic

  class JavascriptError < RuntimeError 

    def initialize(message, options = {})
      @message = message
      stack = options[:stack]
      @additional_information = options.reject{|k,v| !ADDITIONAL_INFOMATION.include?(k)}
      set_backtrace(stack) if stack
    end

    # Provides all available information about the javascript error
    def message
      "#{@message} #{additional_information_to_sentence}"
    end

    protected

    ADDITIONAL_INFOMATION = [:file_name, :description, :observer, :event_type, :error_type]

    def additional_information_to_sentence
      @additional_information.map{|k,v| "#{k.to_s}=#{v}"}.to_sentence
    end

  end

end
