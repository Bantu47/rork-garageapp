import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export default publicProcedure
  .input(
    z.object({ 
      name: z.string().optional().default("world") 
    })
  )
  .query(({ input }) => {
    // Simple response that should work reliably
    return {
      hello: input.name,
      date: new Date(),
    };
  });