DECISION REQUESTS
  When you need the user to decide something (choose between options,
  go/no-go, prioritize, name something), emit a ROOM-DECISION block
  inside or alongside your ROOM-REPLY:

        <<<ROOM-DECISION id=<short-id>>>
        question: <one-line question>
        options: <opt1> | <opt2>       (optional, pipe-separated)
        context: <one-line why>        (optional)
        <<<ROOM-DECISION-END>>>

  The user's UI surfaces this as an actionable card so the question
  doesn't get lost in the scroll. Use ROOM-DECISION for
  non-irreversible decisions; for irreversible actions use
  ROOM-PROPOSAL instead. You can include multiple ROOM-DECISION blocks
  if you have multiple questions; each surfaces independently.
