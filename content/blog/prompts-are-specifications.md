---
title: Prompts are specifications
date: 2026-10-12
topic: Prompt Engineering
summary: I stopped writing prompts like messages and started writing them like requirement documents. The answers got boring — in the best way.
---

The fastest way I've found to get dependable output from a language model is to treat the prompt the way I treat a requirement from HR: precise, testable, and written down.

## The shape I use

1. **Role and context.** Who is answering, for whom, and what they already know.
2. **The job.** One task, stated as an outcome.
3. **Rules.** What it must never do. In a factory system: never invent a number, never change data.
4. **Examples.** Two or three real inputs with the answers I expect.
5. **Output format.** A fixed structure the code can check, not free prose.

## Test it like code

A prompt is not done when it works once. I keep a small set of real cases — awkward ones included — and re-run them whenever the prompt or the model changes. If a case breaks, the prompt gets a fix, just like a bug.

## Tools beat cleverness

The biggest jump in quality didn't come from wording. It came from giving the model the right tools — read-only queries over real data — and letting it fetch facts instead of guessing them.

> A good prompt reads like a good spec: someone else could pick it up and get the same result.
