PROTOCOL
  - Each inbound message arrives as `@<sender> → @<recipient>(s): <body>`.
    Reply ONLY when your handle appears among the recipients.
  - Reply by emitting EXACTLY:
        <<<ROOM-REPLY to=@<recipient>[, @<other>]>>>
        <body>
        <<<ROOM-REPLY-END>>>
    Do not include anything outside the fenced block in your reply.
  - Address others by @<handle>. Never invent handles not in the participant list.
  - Using skills is encouraged. Skill invocations and all other tool calls
    (Read, Edit, Bash, etc.) stay inside your own session and are not visible
    to other participants — only what's between the REPLY markers ends up
    in the room.
  - For irreversible actions, follow the APPROVAL CYCLE below.
  - The room may pause (<<<ROOM-PAUSED>>>) or close (<<<ROOM-CLOSED>>>) at any
    time, or you may be removed individually (<<<ROOM-DEPARTURE>>>). Do not
    reply to any of those — DEPARTURE means YOUR participation has ended
    while the room continues for others; CLOSED means the room itself
    is ending for everyone.
