class Pokemon
  attr_accessor :id, :name, :number, :image, :types, :weight, :height, :abilities, :stats, :description

  def initialize(attributes = {})
    @id = attributes[:id]
    @name = attributes[:name]
    @number = attributes[:number]
    @image = attributes[:image]
    @types = attributes[:types] || []
    @weight = attributes[:weight]
    @height = attributes[:height]
    @abilities = attributes[:abilities] || []
    @stats = attributes[:stats] || {}
    @description = attributes[:description]
  end
end