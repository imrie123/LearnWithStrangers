worker_processes Integer(ENV['WEB_CONCURRENCY'] || 2)
timeout 15
preload_app true

listen "/home/ec2-user/LearnWithStrangers/api/tmp/sockets/unicorn.sock", backlog: 64
pid "/home/ec2-user/LearnWithStrangers/api/tmp/pids/unicorn.pid"

stderr_path File.expand_path('log/unicorn.stderr.log', ENV['RAILS_ROOT'])
stdout_path File.expand_path('log/unicorn.stdout.log', ENV['RAILS_ROOT'])

before_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn master intercepting TERM and sending myself QUIT instead'
    Process.kill 'QUIT', Process.pid
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to send QUIT'
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end

