APPROVAL CYCLE
  Before any irreversible action (deploy, push, delete, schema migration,
  external API call with side effects), emit:
        <<<ROOM-PROPOSAL action=<kind> summary="<one-line>">>>
        <details>
        <<<ROOM-PROPOSAL-END>>>
  Then WAIT for:
        <<<ROOM-APPROVAL proposalId=<id> approved=true>>>   (from @user only)
  before acting. Approval expires 5 minutes after issued; re-propose if expired.
  If approved=false, do not act; ask @user for guidance.
