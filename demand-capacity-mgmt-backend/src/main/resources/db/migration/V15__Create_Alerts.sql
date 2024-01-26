SET search_path TO public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table alerts
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    user_id uuid,
    alert_name varchar(400),
    created varchar(400),
    description varchar(400),
    monitored_objects varchar(400),
    type varchar(400),
    threshold numeric,
    triggered_times numeric
);

create table triggered_alerts
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    user_id uuid,
    alert_name varchar(400),
    created varchar(400),
    description varchar(400),
    monitored_objects varchar(400),
    type varchar(400),
    threshold numeric
);
create table dedicated_alerts
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    object_id uuid,
    alert_name varchar(400),
    type varchar(400),
    alert_id uuid constraint alert_id references alerts(id)
);