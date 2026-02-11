import { Tree, TreeNode } from "react-organizational-chart";
import { useAvatarUrl } from "../../hooks/useAvatar";
import { AvatarDisplay } from "../AvatarDisplay";
import type { OrgChartNode } from "../../services/orgChart";

interface OrgChartTreeProps {
  nodes: OrgChartNode[];
  isEditing?: boolean;
  onAddRoot?: () => void;
  onAddChild?: (node: OrgChartNode) => void;
  onDelete?: (node: OrgChartNode) => void;
  onEdit?: (node: OrgChartNode) => void;
  className?: string;
}

const actionButtonBase =
  "px-2 py-1 text-xs rounded-md border transition-colors";

const OrgChartNodeCard = ({
  node,
  isEditing,
  onEdit,
}: {
  node: OrgChartNode;
  isEditing?: boolean;
  onEdit?: (node: OrgChartNode) => void;
}) => {
  const { avatarUrl } = useAvatarUrl(node.user?.id ?? null, {
    enabled: Boolean(node.user?.id),
  });
  const displayRole =
    (node.position ?? undefined) || node.user?.position || undefined;
  const childCount = node.children?.length ?? 0;

  return (
    <div
      className={`bg-white/10 border border-blue-400/30 rounded-lg p-3 min-w-max backdrop-blur-sm transition-colors ${
        isEditing ? "cursor-pointer hover:bg-white/20" : ""
      }`}
      onClick={() => {
        if (isEditing && onEdit) {
          onEdit(node);
        }
      }}
      role={isEditing ? "button" : undefined}
      tabIndex={isEditing ? 0 : undefined}
      onKeyDown={(event) => {
        if (!isEditing || !onEdit) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit(node);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <AvatarDisplay src={avatarUrl} name={node.name} size="md" />
        <div>
          <p className="text-sm font-semibold text-white">{node.name}</p>
          {displayRole && (
            <p className="text-xs text-gray-400">{displayRole}</p>
          )}
          {childCount > 0 && (
            <p className="text-[11px] text-lightGrey mt-1">
              Direct reports: {childCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const OrgChartNodeLabel = ({
  node,
  isEditing,
  onAddRoot,
  onAddChild,
  onDelete,
  onEdit,
}: {
  node: OrgChartNode;
  isEditing?: boolean;
  onAddRoot?: () => void;
  onAddChild?: (node: OrgChartNode) => void;
  onDelete?: (node: OrgChartNode) => void;
  onEdit?: (node: OrgChartNode) => void;
}) => {
  const isRoot = !node.parentId;

  return (
    <div className="flex flex-col items-center gap-2">
      {isEditing && (
        <div className="flex items-center gap-2">
          {isRoot && onAddRoot && (
            <button
              type="button"
              className={`${actionButtonBase} border-blue-400/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20`}
              onClick={(event) => {
                event.stopPropagation();
                onAddRoot();
              }}
            >
              Add Root
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={`${actionButtonBase} border-red-400/40 bg-red-500/10 text-red-100 hover:bg-red-500/20`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(node);
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
      <OrgChartNodeCard node={node} isEditing={isEditing} onEdit={onEdit} />
      {isEditing && onAddChild && (
        <button
          type="button"
          className={`${actionButtonBase} border-emerald-400/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20`}
          onClick={(event) => {
            event.stopPropagation();
            onAddChild(node);
          }}
        >
          Add Child
        </button>
      )}
    </div>
  );
};

const RootLabel = () => (
  <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg px-4 py-3 min-w-max border border-blue-400/50">
    <p className="text-sm font-bold text-white">Organization</p>
    <p className="text-xs text-blue-100">Structure Overview</p>
  </div>
);

const renderNode = (
  node: OrgChartNode,
  isEditing?: boolean,
  onAddRoot?: () => void,
  onAddChild?: (node: OrgChartNode) => void,
  onDelete?: (node: OrgChartNode) => void,
  onEdit?: (node: OrgChartNode) => void,
) => (
  <TreeNode
    key={node.id}
    label={
      <OrgChartNodeLabel
        node={node}
        isEditing={isEditing}
        onAddRoot={onAddRoot}
        onAddChild={onAddChild}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    }
  >
    {node.children?.map((child) =>
      renderNode(child, isEditing, onAddRoot, onAddChild, onDelete, onEdit),
    )}
  </TreeNode>
);

export const OrgChartTree = ({
  nodes,
  isEditing,
  onAddRoot,
  onAddChild,
  onDelete,
  onEdit,
  className = "",
}: OrgChartTreeProps) => (
  <div className={`overflow-x-auto pb-6 ${className}`}>
    <div className="inline-block min-w-full">
      <Tree
        lineWidth="2px"
        lineColor="#60a5fa"
        lineBorderRadius="10px"
        label={<RootLabel />}
      >
        {nodes.map((node) =>
          renderNode(node, isEditing, onAddRoot, onAddChild, onDelete, onEdit),
        )}
      </Tree>
    </div>
  </div>
);
