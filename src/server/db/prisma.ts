import { NoteStatus, PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (!(global as any).prisma) {
  (global as any).prisma = new PrismaClient();
}
prisma = (global as any).prisma;

declare global {
  namespace PrismaJson {
    interface CategoryDefinition {
      id: string;
      name: string;
      options: {
        name: string;
        color?: string;
      }[];
    }

    interface Category {
      categoryDefinitionId: string;
      option: string;
    }

    interface View {
      name?: string;
      statusFilters?: NoteStatus[];
      categoryFilters?: Category[];
      categoryGroupingId?: string;
      timeWindow?: {
        start?: Date;
        end?: Date;
      };
      tagFilters?: string[];
    }
  }
}

export default prisma as PrismaClient;
