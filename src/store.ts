import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { resolve, join } from 'node:path';

export type Turn = { role: 'user' | 'assistant'; content: string };
export type Job = { id: string; event_id: string; chat: string; sender: string; text: string; reply: string | null; attempts: number; next_at: number; state: string };

export class Store {
  directory: string;
  db: DatabaseSync;
  constructor(directory: string) {
    this.directory = resolve(directory);
    mkdirSync(this.directory, { recursive: true, mode: 0o700 });
    const file = join(this.directory, 'agent.sqlite');
    this.db = new DatabaseSync(file);
    chmodSync(file, 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS turns(seq INTEGER PRIMARY KEY, scope TEXT, role TEXT, content TEXT);
      CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY, event_id TEXT UNIQUE, chat TEXT, sender TEXT, text TEXT,
        reply TEXT, attempts INTEGER DEFAULT 0, next_at INTEGER DEFAULT 0, state TEXT DEFAULT 'pending', last_error TEXT);
      CREATE TABLE IF NOT EXISTS voice_replies(key TEXT PRIMARY KEY, attachment TEXT, state TEXT NOT NULL DEFAULT 'new');`);
  }
  enqueue(job: Pick<Job, 'id' | 'event_id' | 'chat' | 'sender' | 'text'>): boolean {
    return this.db.prepare('INSERT OR IGNORE INTO jobs(id,event_id,chat,sender,text) VALUES(?,?,?,?,?)').run(job.id, job.event_id, job.chat, job.sender, job.text).changes > 0;
  }
  next(now = Date.now()): Job | undefined {
    const job = this.db.prepare("SELECT * FROM jobs WHERE state='pending' ORDER BY rowid LIMIT 1").get() as Job | undefined;
    return job && job.next_at <= now ? job : undefined;
  }
  saveReply(id: string, reply: string) { this.db.prepare('UPDATE jobs SET reply=? WHERE id=?').run(reply, id); }
  retry(id: string, attempts: number, error: string) {
    this.db.prepare('UPDATE jobs SET attempts=?,next_at=?,state=?,last_error=? WHERE id=?').run(attempts, Date.now() + Math.min(60_000, 1000 * 2 ** attempts), attempts >= 3 ? 'failed' : 'pending', error, id);
  }
  finish(job: Job, reply: string) {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      this.addTurn(job.sender, 'user', job.text);
      this.addTurn(job.sender, 'assistant', reply);
      this.db.prepare("UPDATE jobs SET state='accepted' WHERE id=?").run(job.id);
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  addTurn(scope: string, role: Turn['role'], content: string) {
    this.db.prepare('INSERT INTO turns(scope,role,content) VALUES(?,?,?)').run(scope, role, content);
    this.db.prepare('DELETE FROM turns WHERE scope=? AND seq NOT IN (SELECT seq FROM turns WHERE scope=? ORDER BY seq DESC LIMIT 20)').run(scope, scope);
  }
  history(scope: string): Turn[] { return this.db.prepare('SELECT role,content FROM turns WHERE scope=? ORDER BY seq').all(scope) as Turn[]; }
  reset(scope: string) { this.db.prepare('DELETE FROM turns WHERE scope=?').run(scope); }
  // Compatibility with the presentation's Mem0 adapter; no legacy memory in this starter.
  memories(_scope: string): string[] { return []; }
  forget(_scope: string) {}
  forgetOne(_scope: string, _text: string) {}
  stats() { return this.db.prepare('SELECT state,COUNT(*) AS count FROM jobs GROUP BY state').all(); }
  close() { this.db.close(); }
}
