
export PGDATA="/usr/local/var/postgres"

psql -d tagbull_rails_development -f "$(dirname $0)/sample_data.sql"
