alter table public.reading_checkpoints drop constraint if exists reading_checkpoints_words_check;
alter table public.reading_checkpoints add constraint reading_checkpoints_words_check
  check (cardinality(words) between 1 and 8);
