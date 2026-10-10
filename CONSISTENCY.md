# Consistency

Rules the design system cannot hold. Tokens, type styles, and components do not know whether a section may have a subtitle, or whether this kind of text is sentence case or caps. Write those rules here.

`DESIGN.md` is what it looks like (color, type, space, components).
`VOICE.md` is how it sounds (tone, shame, empty/error attitude).
This file is how we always do it when the system has no variant for the choice.

If a rule can live as a component, token, or type style, put it in the system instead. Do not duplicate it here.

Each rule: where it applies, do, don't, why. Same shape as an in-product word list (Intuit, Spectrum): one preferred behavior, a banned one, and the reason. Not a dictionary. Only house rules.

## Structure

| Where | Do | Don't | Why |
|-------|----|-------|-----|
| Section headers | One heading. Body starts under it. | Subtitles / supporting lines under the heading | [e.g. extra line competes with the heading] |
| [page type] | [pattern] | [pattern] | [why the system cannot encode this] |

## Casing and emphasis

| Where | Do | Don't | Why |
|-------|----|-------|-----|
| [e.g. page titles] | [sentence case / title case] | [the other] | |
| [e.g. legal / status chips] | [caps or not] | [ALL CAPS for emphasis elsewhere] | Emphasis is not a type style we ship |
| Buttons and nav | [match the label casing] | Mixed casings for the same action | |

## Wording the system cannot see

Not a glossary. Only rules about *how* words show up: one name per object, no directional "above/below," name the control by its label.

| Where | Do | Don't | Why |
|-------|----|-------|-----|
| Same object across screens | One term from the user | Internal name, then a synonym next screen | Agents invent synonyms |
| Pointing at UI | Use the visible label | "the button," "click here," "see below" | Direction and chrome names fail a11y |
| [product-specific] | | | |

## When to add a rule

- You keep restyling the same choice by hand
- Two screens disagree and no component explains why
- The agent added a subtitle, a second heading, or random caps

## Test

Pick three screens. If a human has to remember the rule to stay consistent, it belongs here. If a component or type style could force it, move it into the system.
