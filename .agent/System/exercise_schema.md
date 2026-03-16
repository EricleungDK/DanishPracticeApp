# Exercise Schema — Danish Practice Generator

**Last Updated**: 2026-03-16

## Template Format

All exercise templates are stored as JSON. Each template has a common base structure plus type-specific fields.

### Base Fields (all types)

```json
{
  "id": "uuid-string",
  "type": "fill_blank | sentence_construction | reading | listening",
  "difficulty": "B1 | B2",
  "topic": "grammar topic or vocabulary theme",
  "danish_text": "Danish content",
  "english_text": "English translation",
  "answer_key": {},
  "metadata": {}
}
```

## Type-Specific Schemas

### Fill in the Blank

```json
{
  "type": "fill_blank",
  "danish_text": "Jeg ___ til skole hver dag.",
  "english_text": "I ___ to school every day.",
  "answer_key": {
    "correct": ["går"],
    "accept_also": ["gaar"]
  },
  "metadata": {
    "hint": "verb, present tense of 'to go'",
    "grammar_point": "present tense regular verbs",
    "blank_position": 1
  }
}
```

### Sentence Construction

```json
{
  "type": "sentence_construction",
  "danish_text": "Jeg har aldrig været i Danmark.",
  "english_text": "I have never been to Denmark.",
  "answer_key": {
    "correct_order": ["Jeg", "har", "aldrig", "været", "i", "Danmark"],
    "words_given": ["Danmark", "aldrig", "har", "i", "Jeg", "været"],
    "accept_also": []
  },
  "metadata": {
    "grammar_point": "word order with adverbs",
    "focus_word": "aldrig"
  }
}
```

### Reading Comprehension

```json
{
  "type": "reading",
  "danish_text": "Full passage in Danish...",
  "english_text": "English translation of passage...",
  "answer_key": {
    "questions": [
      {
        "question_da": "Hvad handler teksten om?",
        "question_en": "What is the text about?",
        "type": "multiple_choice",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_index": 0
      },
      {
        "question_da": "Hvad betyder 'ordet'?",
        "question_en": "What does 'the word' mean?",
        "type": "free_text",
        "correct": ["accepted answer 1", "accepted answer 2"]
      }
    ]
  },
  "metadata": {
    "word_count": 150,
    "topic": "daily life"
  }
}
```

### Listening

```json
{
  "type": "listening",
  "danish_text": "Text that will be spoken via TTS",
  "english_text": "English translation",
  "answer_key": {
    "mode": "transcribe | multiple_choice | fill_blank",
    "correct": ["exact transcription or answer"],
    "accept_also": ["minor spelling variations"]
  },
  "metadata": {
    "tts_speed": "normal | slow",
    "repeat_allowed": true,
    "focus": "pronunciation | vocabulary | comprehension"
  }
}
```

## Wordlist Format

```json
{
  "id": "uuid",
  "danish": "hus",
  "english": "house",
  "part_of_speech": "noun",
  "gender": "et",
  "cefr_level": "B1",
  "topic": "home",
  "example_sentence": "Vi bor i et stort hus.",
  "irregular_forms": {
    "definite": "huset",
    "plural": "huse",
    "definite_plural": "husene"
  }
}
```

## CEFR Level Mapping

| Level | Grammar | Vocabulary | Sentence Length |
|-------|---------|-----------|-----------------|
| B1 | Present/past tense, common conjunctions, basic subordinate clauses | ~2000 common words | 5-12 words |
| B2 | Subjunctive, passive voice, complex subordination, idiomatic expressions | ~4000 words incl. abstract | 8-20 words |

## Validation Rules

1. Every template MUST have danish_text and english_text
2. answer_key MUST contain at least one correct answer
3. Danish text MUST use proper characters (æ, ø, å)
4. difficulty MUST be "B1" or "B2"
5. type MUST be one of: fill_blank, sentence_construction, reading, listening
6. Wordlist nouns MUST have gender (en/et)
7. All JSON must be valid and parseable
