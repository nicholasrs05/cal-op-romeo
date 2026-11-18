import z from "zod";

const UserItemSchema = z.object({
  id: z.string(),
  nama: z.string(),
  panggoaran: z.string().nullable(),
  tgllahir: z.string(),
  blnlahir: z.string(),
  thnlahir: z.string(),
});

export type UserItem = z.infer<typeof UserItemSchema>;