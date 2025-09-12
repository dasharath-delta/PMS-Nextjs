import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  firstname: varchar('firstname', { length: 50 }),
  lastname: varchar('lastname', { length: 50 }),
  bio: varchar('bio', { length: 255 }).default(null),
  dob: date('dob').default(null),
  phone: varchar('phone', { length: 15 }).default(null), 
  location: varchar('location', { length: 100 }).default(null),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
