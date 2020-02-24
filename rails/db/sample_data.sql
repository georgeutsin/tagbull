-- TODO: replace this with seeds.rb

DELETE FROM bounding_box_samples;
DELETE FROM bounding_box_tasks;
DELETE FROM basic_task_events;
DELETE FROM samples;
DELETE FROM actors;
DELETE FROM media;
DELETE FROM tasks;
DELETE FROM projects;

INSERT INTO actors VALUES (0, NOW(), NOW(), 'GENERATED');


INSERT INTO projects (id, name, created_at, updated_at) VALUES (1, 'Open Images Project', now(), now());

INSERT
INTO
        tasks (id, pending_timestamp, project_id, created_at, updated_at, actable_type, actable_id, media_id)
VALUES
        (1, NULL, 1, now(), now(), 'BoundingBoxTask', 1, 1),
        (2, NULL, 1, now(), now(), 'BoundingBoxTask', 2, 2),
        (3, NULL, 1, now(), now(), 'BoundingBoxTask', 3, 3),
        (4, NULL, 1, now(), now(), 'BoundingBoxTask', 4, 4),
        (5, NULL, 1, now(), now(), 'BoundingBoxTask', 5, 5),
        (6, NULL, 1, now(), now(), 'BoundingBoxTask', 6, 6),
        (7, NULL, 1, now(), now(), 'BoundingBoxTask', 7, 7),
        (8, NULL, 1, now(), now(), 'BoundingBoxTask', 8, 8),
        (9, NULL, 1, now(), now(), 'BoundingBoxTask', 9, 9),
        (10, NULL, 1, now(), now(), 'BoundingBoxTask', 10, 10);

INSERT
INTO
        bounding_box_tasks (id, category, created_at, updated_at)
VALUES
        (1, 'television', now(), now()),
        (2, 'person', now(), now()),
        (3, 'car', now(), now()),
        (4, 'mechanical fan', now(), now()),
        (5, 'pen', now(), now()),
        (6, 'flower', now(), now()),
        (7, 'official', now(), now()),
        (8, 'ant', now(), now()),
        (9, 'glass bottle', now(), now()),
        (10, 'person', now(), now());

INSERT
INTO
        media (id, name, url, created_at, updated_at)
VALUES
        (
                1,
                'afbe6bee0226cd91',
                'https://lh3.googleusercontent.com/q0wbpyLn6ycBkjElBjKsyC4mnjU_-RzK4n9cok4HC1fESjYMvph_rDwKoLM6V2vRG-40s92JNg=s0',
                now(),
                now()
        ),
        (
                2,
                '96d65179732b59ec',
                'https://lh3.googleusercontent.com/e_PjnNTVrjAnVbA-X8IRc_MB82-hGcT7_jG15ucHGezmNLm90u8wPAwBv0fYGLM3uq707cFK=s0',
                now(),
                now()
        ),
        (
                3,
                'd7d678178da7958e',
                'https://lh3.googleusercontent.com/jV7yBb0fDbId2Yb05DODRSxINjJK-EdshrYYtmA4ADtYmmG5uvEDGg9CHmKFNHaz_5C2XJHIJdI=s0',
                now(),
                now()
        ),
        (
                4,
                'e808d5949d7157ef',
                'https://lh3.googleusercontent.com/lrZ01OhyKK74FL_ySzFb_OzKliLhBKbTbEfCwqjmawkcvF9gCUkHUnmddLc-5u19zmilUI9kcg=s0',
                now(),
                now()
        ),
        (
                5,
                '62c2eaaefdb38f4d',
                'https://lh3.googleusercontent.com/3gPrKaNNo9ibllGcx9jJKdqUUhZgXtSRFXsQ5EOjQ0K6Iycxjq9babN6hw7A7Nrmmgy1aOaiCw=s0',
                now(),
                now()
        ),
        (
                6,
                '84f7ecec44f1b38e',
                'https://lh3.googleusercontent.com/hpd5UC0VHd0SsF03hfcB4jabp0ZPraahY1dT3SjxIb0-RpFJukSs79r8E1phW7329_x_zS-Bd0g=s0',
                now(),
                now()
        ),
        (
                7,
                'd38b8b2aac58e772',
                'https://lh3.googleusercontent.com/XvXwfJS9TPLE5u2F5Kp2VUK5QIaZbhRzfz6o91DB8bryW8AtSNS5zgQS5gbiVXuJUuyVUKDdeA=s0',
                now(),
                now()
        ),
        (
                8,
                'f0c16eff2553867f',
                'https://lh3.googleusercontent.com/H0bhkIuoCzGRPNxX8nVIhvt3CFEYpgHjyRxGMN57_FUYXmqKbS6sHGvgFvMmEiVKT_zDrpGtkA=s0',
                now(),
                now()
        ),
        (
                9,
                '254a2e6b700b68d3',
                'https://lh3.googleusercontent.com/acrk1shRkItrqpOy_PTuqhPdOKKKvjXUugJlhDEb-BWf1NWu2w-meSsQFOF5s6jHeaSCIkP9lQ=s0',
                now(),
                now()
        ),
        (
                10,
                'bd0b0dd6e91c86f4',
                'https://lh3.googleusercontent.com/5KwmlUHu5m1c-0sBPn2VZr51m1bFj0QJrZ1lR_KzkjchTrWrC4_AiO_ZQphulV9qdi84SZivdg=s0',
                now(),
                now()
        );

-- Postgres's autoincrement values are not updated when we manually insert id's. This is bad, because
--   when we try to insert a row with autoincrementing id, an error occurs since a row with the given
--   id already exists.
SELECT setval('projects_id_seq', (SELECT MAX(id) from projects));
SELECT setval('tasks_id_seq', (SELECT MAX(id) from tasks));
SELECT setval('bounding_box_tasks_id_seq', (SELECT MAX(id) from bounding_box_tasks));
SELECT setval('media_id_seq', (SELECT MAX(id) from media));
