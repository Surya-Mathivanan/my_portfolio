---
title: Shipping software people get paid by
date: 2026-09-28
topic: Industry Apps
summary: When a bug changes someone's salary, "it works on my machine" stops being funny. Notes on building live industry applications.
---

College projects are judged on the demo day. Industry software is judged on the 1st of every month, when people open their payslips.

## Replay real months

Before trusting a payroll change, I replay a full month of real punches through it and compare the result with the last good run. Edge cases — night shifts, missing punches, permissions, holidays — only show up in real data.

## Deploy with a way back

Every release has backups and a rollback path. Shipping fast is only safe when undoing is faster.

## Be reachable

The best bug reports come from a phone call on the floor. Being close to the people who use the system — HR, supervisors, employees — turns a vague "salary is wrong" into a precise, fixable case.

## The loop never closes

Requirements, planning, mapping, building, testing, deployment, execution, bug fixing, redeployment — then back to requirements. Five months in, the loop is the job, and it keeps teaching me something new every cycle.
