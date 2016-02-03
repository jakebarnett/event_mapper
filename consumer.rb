require "bundler/setup"

require "kafka/consumer"
require 'geoip'
require 'pusher'

Pusher.url = ENV["PUSHER_URL"]

zookeeper = ENV["ZOOKEEPER_URL"]
name      = "jakes-hackday-consumer"
topics    = ["events-raw"]


consumer = Kafka::Consumer.new(name, topics, zookeeper: zookeeper)

Signal.trap("INT") { consumer.interrupt }

consumer.each do |message|
  payload = JSON.parse(message.value)
  ip = payload["request"]["REMOTE_ADDR"]
  c = GeoIP.new('GeoLiteCity.dat').city(ip)
  unless c.city_name.empty?
    data = "#{c.latitude}, #{c.longitude}, #{c.city_name} - #{c.country_name}"
  end
  puts data
  Pusher.trigger('test_channel', 'my_event', {
    latitude: c.latitude,
    longitude: c.longitude,
    city: c.city_name,
    country: c.country_name
    })
end
