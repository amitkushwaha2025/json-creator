import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Schema Field Types
export const FieldTypeEnum = z.enum(["String", "Number", "Float", "Boolean", "ObjectId", "Nested"]);
export type FieldType = z.infer<typeof FieldTypeEnum>;

// Schema Field Structure
export const SchemaFieldSchema: z.ZodType<SchemaField> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().min(1, "Field name is required"),
    type: FieldTypeEnum,
    defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
    nested: z.array(SchemaFieldSchema).optional(),
  })
);

export type SchemaField = {
  id: string;
  name: string;
  type: FieldType;
  defaultValue?: string | number | boolean;
  nested?: SchemaField[];
};

// Form Schema for validation
export const SchemaBuilderFormSchema = z.object({
  fields: z.array(SchemaFieldSchema),
});

export type SchemaBuilderForm = z.infer<typeof SchemaBuilderFormSchema>;
