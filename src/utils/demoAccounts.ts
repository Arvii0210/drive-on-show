export interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'author' | 'reviewer';
  eventSlug?: string;
}

const DEMO_USERS: StoredUser[] = [
  { name: 'Admin User', email: 'admin@hallmark.com', password: 'admin123', role: 'admin' },
  { name: 'Reviewer User', email: 'reviewer@hallmark.com', password: 'reviewer123', role: 'reviewer' },
];

export function initDemoAccounts() {
  const existing = localStorage.getItem('app_users');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('app_users', JSON.stringify(DEMO_USERS));
  } else {
    // Ensure demo accounts exist
    const users: StoredUser[] = JSON.parse(existing);
    let changed = false;
    for (const demo of DEMO_USERS) {
      if (!users.find(u => u.email === demo.email)) {
        users.push(demo);
        changed = true;
      }
    }
    if (changed) localStorage.setItem('app_users', JSON.stringify(users));
  }
}

export function findUser(email: string, password: string): StoredUser | undefined {
  const users: StoredUser[] = JSON.parse(localStorage.getItem('app_users') || '[]');
  return users.find(u => u.email === email && u.password === password);
}
