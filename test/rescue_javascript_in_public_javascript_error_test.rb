require 'test/unit'
$:.unshift(File.dirname(__FILE__) + '/../lib')
require 'test/unit'
require File.expand_path(File.join(File.dirname(__FILE__), '../../../../config/environment.rb'))
require 'rubygems'

require File.dirname(__FILE__) + '/../lib/rescue_javascript_in_public/javascript_error'

class RescueJavascriptInPublicJavascriptError < Test::Unit::TestCase

  def test_that_it_identifies_itself_as_as_javascript_error_in_the_message
    error = RescueJavascriptInPublic::JavascriptError.new("handler failed", "on_error")
    puts error.message
    assert error.message.include?('Rescued Javascript Error (on error)')
    assert error.message.include?('handler failed')
  end

  def test_that_passing_stack_option_will_set_the_backtrace
    javascript_stack = ["Some error in some function: 13", "Another level of the stack"]
    error = RescueJavascriptInPublic::JavascriptError.new("handler failed", "on_error", {:stack => javascript_stack})
    assert_equal javascript_stack, error.backtrace, "the backtrace was not set"
  end

  def test_that_optional_information_ends_up_in_the_error_message
    [
      [:file_name, 'test.js'],
      [:description, 'An IE descriptoin message'],
      [:observer, 'Info about the observer'],
      [:event_type, 'Info about the event'],
    ].each do |option_info|
      option, value = option_info
      error = RescueJavascriptInPublic::JavascriptError.new("handler failed", "on_error", option => value)
      assert error.message.include?("#{option}=#{value}")
    end
  end
end
