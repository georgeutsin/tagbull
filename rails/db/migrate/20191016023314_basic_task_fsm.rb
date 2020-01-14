class BasicTaskFsm < ActiveRecord::Migration[6.0]
  def change
    execute <<-SQL
      CREATE FUNCTION basic_task_transition(state TEXT, event text) RETURNS text LANGUAGE sql AS
      $$
        SELECT CASE state
          WHEN 'start' THEN
            CASE
              WHEN event = 'sample' THEN 'sampling'
              WHEN event IS NULL THEN 'start'
              ELSE 'error'
            END
          WHEN 'sampling' THEN
            CASE event
              WHEN 'sample' THEN 'comparing'
              ELSE 'error'
            END
          WHEN 'comparing' THEN
            CASE event
              WHEN 'similar' THEN 'complete'
              WHEN 'dissimilar' THEN 'sampling'
              ELSE 'error'
            END
          ELSE 'error'
        END
      $$;
    SQL

    execute <<-SQL
      /* An Aggregate is perfect: it is a closure that stores a single state and takes input */
      CREATE AGGREGATE basic_task_fsm(text) (
        SFUNC = basic_task_transition,
        STYPE = text,
        INITCOND = 'start'
      );
    SQL

    execute <<-SQL
      /* Returns a trigger that validates a single fsm transition */
      CREATE FUNCTION basic_task_trigger_func() RETURNS trigger
      LANGUAGE plpgsql AS $$
      DECLARE
        new_state text;
      BEGIN
        SELECT basic_task_fsm(event ORDER BY id)
        FROM (
          SELECT id, event FROM basic_task_events WHERE task_id = new.task_id
          UNION
          SELECT new.id, new.event
        ) s
        INTO new_state;

        IF new_state = 'error' THEN
          RAISE EXCEPTION 'invalid event';
        END IF;

        RETURN new;
      END
      $$;
    SQL

    execute <<-SQL
      CREATE TRIGGER basic_task_trigger BEFORE INSERT ON basic_task_events
      FOR EACH ROW EXECUTE PROCEDURE basic_task_trigger_func();
    SQL

    execute <<-SQL
      CREATE VIEW basic_task_states AS
        SELECT tasks.id, basic_task_fsm(events.event ORDER BY events.id) state
        FROM tasks
        LEFT JOIN basic_task_events as events ON events.task_id = tasks.id
        GROUP BY tasks.id;
    SQL
  end
end
