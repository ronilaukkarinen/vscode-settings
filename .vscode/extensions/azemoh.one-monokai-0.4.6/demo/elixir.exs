defmodule Foo do
  import IO, only: [puts: 1]
  import Kernel, except: [inspect: 1]

  # alias ModulePlay.Util.Math as is
  alias Foo.Util.Math, as: Math

  require Integer

  def say_here do
    IO.puts "I'm Here"
  end

  def greet(who) do
    inspect "Hello #{who || "World"}"
  end

  def inspect(param1) do
    puts "Starting Output"
    puts param1
    puts "Ending Output"
  end

  def print_sum do
    Math.add(2, 5)
  end

  # This is a comment
  def print_is_even(num) do
    puts "Is #{num} even? #{Integer.is_even(num)}"
  end
end
