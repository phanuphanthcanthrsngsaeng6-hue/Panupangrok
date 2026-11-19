# Speech-to-text (transcription)

This Whisper-compatible surface uses [shared platform authentication](service-api.md#calling-the-platform-api-surface).

## Endpoint

`POST $MANUS_API_URL/v1/audio/transcriptions`, multipart form data.

| Field | Contract |
| --- | --- |
| `file` | Audio bytes; supported formats are webm, mp3, wav, ogg, m4a, mp4 |
| `model` | Required: `whisper-1` or `scribe_v2`; they differ as described in [Models](#models) |
| `response_format` | The endpoint selects `verbose_json`, including when this field is omitted |
| `prompt` | `whisper-1` only: optional context hint, including domain vocabulary or language context |
| `language` | `scribe_v2` only: optional language code such as `en` or `zh`; omitted selects automatic detection |

## Models

| | `whisper-1` | `scribe_v2` |
| --- | --- | --- |
| Response fields | `task`, `language`, `duration`, `text`, `segments` | The same fields plus `words` |
| `language` value | Language name, such as `chinese` | ISO 639-3 code, such as `zho` or `eng` |
| Segment fields | `id`, `start`, `end`, `text`, and confidence metadata `avg_logprob`, `no_speech_prob`, `compression_ratio` | `id`, `start`, `end`, `text` only |
| Word timestamps | Only when the request adds `timestamp_granularities[]=word`; `segments` is then omitted unless `timestamp_granularities[]=segment` is also sent | Always: `words[]` entries of `word`, `start`, `end`; punctuation can be a separate entry, and spacing is not included |

`text` is the full transcription in both. `scribe_v2` text and segment text can also contain bracketed audio-event annotations such as `(laughter)` or `[笑]`; strip them when only spoken words are wanted. Omitting `response_format` does not select a text-only response.

Choose `scribe_v2` for long recordings, files up to 100 MiB or word-level timing, and keep `whisper-1` where existing code reads its segment confidence fields. Code that compares `language` must match the selected model's form.

`scribe_v2` cuts segments at pauses and at a maximum segment length, so a boundary can fall inside a sentence. For sentence-level captions, group `words` by punctuation instead of treating each segment as a sentence, and add spaces between words only for languages written with them.

## Capture, persistence and errors

When the speaker's language is known, pass it as `language` to `scribe_v2`, or say it explicitly in `prompt` for `whisper-1` and add relevant domain vocabulary as a context hint. For example: “Transcribe the user's voice to text; the working language is <language>.”

Capture audio in the browser, validate upload size, and send it to a trusted application server or durable storage. The server sends the audio bytes to the transcription endpoint as multipart data and returns the result. When later application behavior needs the transcript or timestamps, persist `text` and `segments` (and `words` when used) in the database.

Show upload-size and unsupported-format errors to the user. `scribe_v2` returns 413 for a file over 100 MiB and 400 for bytes it cannot decode as audio. Retry only transient service failures; a permanently invalid recording should not trigger a retry loop.

The template's `_core` voice helper is one `whisper-1` client, not the endpoint contract: the 16 MB limit and Whisper response type are the helper's own. Choose the model from this page first; a `scribe_v2` call needs its own request and response type.
