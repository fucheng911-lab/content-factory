import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Panel, PanelHeader } from "../components/ui/Panel";
import { useProjectStore } from "../store/projectStore";

const statusLabel = {
  draft: "草稿中",
  generated: "已生成初稿",
  editing: "修改中",
  final: "已确认录制稿",
};

export function HomePage() {
  const { projects, fetchProjects, deleteProject } = useProjectStore();

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">内容项目</h1>
          <p className="mt-1 text-sm text-muted-foreground">创建项目，启用 Markdown Skills，制作可录制口播稿。</p>
        </div>
        <Link to="/create">
          <Button>
            <Plus className="h-4 w-4" />
            新建项目
          </Button>
        </Link>
      </div>

      <Panel>
        <PanelHeader title="项目列表" description="所有数据保存在本机 data/projects 目录。" />
        <div className="grid gap-3 p-5">
          {projects.length === 0 && <div className="rounded-md bg-muted p-8 text-center text-sm text-muted-foreground">还没有项目，先创建一个口播稿项目。</div>}
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between rounded-md border border-border p-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{project.title}</h3>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{statusLabel[project.status]}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.platform} · {project.contentType} · {project.targetDuration}s · {project.audience}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/editor/${project.id}`}>
                  <Button variant="secondary">
                    <Edit3 className="h-4 w-4" />
                    打开
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => void deleteProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
