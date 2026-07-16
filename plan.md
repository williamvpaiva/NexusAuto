# Orca IDE + NexusAuto Integration Plan

## Objective
Integrate Orca IDE with NexusAuto for:
1. Agent/Skill management via Orca worktrees
2. API orchestration between Orca and NexusAuto backend
3. Mobile monitoring via Orca companion

## Integration Approaches

### Approach A: Orca as Parallel Development Environment
- Use Orca worktrees to run NexusAuto agents in parallel
- Each worktree = 1 agent working on isolated tasks
- Merge results back to main repo

**Pros**: No backend changes needed, immediate value
**Cons**: Agents don't share state, manual coordination

### Approach B: Orca CLI as Orchestration Layer
- NexusAuto Tech Lead invokes Orca CLI commands
- Orca manages agent worktrees based on task queue
- Centralized task dispatch via Orca

**Pros**: Full orchestration, single interface
**Cons**: Requires Orca CLI setup, more complex

### Approach C: API Bridge (Recommended)
- NexusAuto backend exposes REST API for Orca
- Orca calls NexusAuto APIs to create agents, manage tasks, access memory
- Mobile companion monitors NexusAuto status

**Pros**: Best of both worlds, scalable
**Cons**: API development required

---

## Recommended: Hybrid Approach (A + C)

### Phase 1: Foundation (Immediate)
1. Configure `orca.yaml` for NexusAuto project
2. Create Orca worktrees for 5 core agents:
   - `nexus-tech-lead`
   - `nexus-frontend-dev`
   - `nexus-backend-dev`
   - `nexus-security`
   - `nexus-qa-tester`
3. Map agent files to worktree contexts

### Phase 2: API Bridge (Week 1-2)
1. Create `/api/orca` routes in NexusAuto backend:
   - `POST /api/orca/worktree` - Create worktree for agent
   - `GET /api/orca/worktrees` - List active worktrees
   - `POST /api/orca/task` - Dispatch task to worktree
   - `GET /api/orca/status` - Get worktree status
   - `POST /api/orca/snapshot` - Create memory snapshot

2. Create Orca CLI wrapper script:
   ```bash
   # nexus-oca.sh
   orca worktree create --agent $1 -- $2
   orca run --agent $1 --prompt "Load .ai-factory/agents/$1.md and execute task"
   ```

### Phase 3: Skill Integration (Week 2-3)
1. Create `skills/orca-bridge/SKILL.md` for Orca integration
2. Add Orca commands to Tech Lead slash commands:
   - `/orca-create <agent> <task>` - Create worktree + dispatch
   - `/orca-status` - Show all active worktrees
   - `/orca-merge <worktree>` - Merge completed work

### Phase 4: Mobile Monitoring (Week 3-4)
1. NexusAuto backend exposes status API
2. Orca companion connects to `http://localhost:3000/api/status`
3. Real-time task progress on mobile

---

## Configuration Files

### orca.yaml (Root of NexusAuto)
```yaml
name: NexusAuto AI Factory
version: "1.0"
agents:
  - name: nexus-tech-lead
    cli: opencode
    workdir: ".ai-factory/agents"
  - name: nexus-frontend-dev
    cli: opencode
    workdir: ".ai-factory/agents"
  - name: nexus-backend-dev
    cli: opencode
    workdir: ".ai-factory/agents"
  - name: nexus-security
    cli: opencode
    workdir: ".ai-factory/agents"
  - name: nexus-qa-tester
    cli: opencode
    workdir: ".ai-factory/agents"
```

### NexusAuto API Routes to Add
```
backend/src/routes/orca.ts
```

---

## Implementation Tasks

### Task 1: Create orca.yaml
- File: `D:\NexusAuto\orca.yaml`
- Content: Agent definitions for 5 core agents

### Task 2: Create Orca Bridge Skill
- File: `D:\NexusAuto\.ai-factory\skills\orca-bridge\SKILL.md`
- Purpose: Orchestrate Orca worktrees from NexusAuto

### Task 3: Add Orca API Routes
- File: `D:\NexusAuto\backend\src\routes\orca.ts`
- Endpoints: CRUD for worktrees, task dispatch

### Task 4: Update Tech Lead Agent
- File: `D:\NexusAuto\.ai-factory\agents\tech-lead.md`
- Add: Orca integration commands

### Task 5: Docker Compose Update
- Add Orca CLI to app container (or run Orca on host)

---

## Success Criteria
- [ ] 5 agents can run in parallel Orca worktrees
- [ ] Tech Lead can dispatch tasks via Orca CLI
- [ ] Mobile companion shows real-time status
- [ ] Memory syncs between Orca and NexusAuto

---

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Orca not installed | High | Document install steps in README |
| API conflicts | Medium | Use separate ports (Orca: 8787, NexusAuto: 3000) |
| Memory sync issues | Medium | Use SQLite as source of truth |
| Mobile companion limits | Low | Focus on status monitoring first |

---

## Next Steps
1. User approves plan
2. Create orca.yaml
3. Create orca-bridge skill
4. Add API routes
5. Test with single agent worktree
6. Scale to 5 agents
