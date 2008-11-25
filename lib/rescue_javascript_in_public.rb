module RescueJavascriptInPublic

  class JavascriptError < RuntimeError 

    def initialize(vals)
      # maybe pass stack trace to set_stack_trace
      @info = vals
      set_backtrace(["somefile:1:in whatever()", "somefile:2:in whatever()"])
    end

    def message
      "Something went wrong in javascript world " + @info.inspect
    end

  end

end
