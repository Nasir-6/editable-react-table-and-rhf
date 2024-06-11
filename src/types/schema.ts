import { z, ZodType } from "zod"; // Add new import
export const dataName = "tableData"; // !Important - this name is used to hook up the forms/fields properly - hence extracted out into a variable!

export type TDateTime = {
  [key: string]: string; // Added to remove errors with column : {id} type id not being a key of TDateTime when using rhf getValue
  date: string;
  time1: string;
  time2: string;
  time3: string;
  time4: string;
};
export type FormDataType = { [dataName: string]: TDateTime[] };

export const DateTimeSchema: ZodType<FormDataType> = z.object({
  [dataName]: z
    .object({
      date: z.string(),
      time1: z.string().min(1, "Needs atleast 1 character"), // Basic Validation
      time2: z.string(),
      time3: z.string(),
      time4: z.string(),
    })
    .array(),
});
