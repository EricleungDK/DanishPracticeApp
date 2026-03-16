# /update_doc

Update project documentation after changes are made.

Run this command after:
- Implementing a new feature
- Modifying SQLite schema
- Adding exercise templates or wordlists
- Changing IPC channels
- Updating architecture

Usage:
```
/update_doc <document-name> <changes>
```

Examples:
```
/update_doc database_schema "Added session_history table"
/update_doc exercise_schema "Added new listening exercise format"
/update_doc project_architecture "Added TTS module to main process"
```

This will update the corresponding file in `.agent/System/` or `.agent/SOP/`.
