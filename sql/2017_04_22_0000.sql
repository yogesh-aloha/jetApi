ALTER TABLE movie_video_encodes ADD COLUMN encode_type_id  bigint(32) NOT NULL;
ALTER TABLE movie_video_encodes DROP COLUMN encode_type;