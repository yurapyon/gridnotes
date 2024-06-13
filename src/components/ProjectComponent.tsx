import { trpc } from "@/lib/trpc/trpc-client";

export const ProjectComponent: React.FC<{
  projectId: string;
  className?: string;
}> = ({ projectId, className = "" }) => {
  const { data: currentProject } = trpc.projects.getById.useQuery({
    id: projectId,
  });
  return <div className={[className].join(" ")}>{currentProject?.name}</div>;
};
