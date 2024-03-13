import { useEffect, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { SpanTreeNode } from "../module/exporter";
import { exporter } from "../module/tracerProvider";

function mapTree(tree: SpanTreeNode): Parameters<typeof flattenTree>[0] {
  const name = `${tree.span?.name} - ${tree.span?.attributes["promise"]}`;
  return {
    name,
    children: tree.children.map(mapTree),
  };
}

const SpanTreeView = () => {
  const [data, setData] = useState(flattenTree(mapTree(exporter.root)));

  useEffect(() => {
    function onSpansUpdated(tree: SpanTreeNode) {
      console.dir(mapTree(tree));
      setData(flattenTree(mapTree(tree)));
    }
    exporter.addListener(onSpansUpdated);
    return () => {
      exporter.removeListener(onSpansUpdated);
    };
  }, []);

  return (
    <TreeView
      data={data}
      className="basic"
      aria-label="basic example tree"
      nodeRenderer={({ element, getNodeProps, level, handleSelect }) => (
        <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
          {element.name}
        </div>
      )}
    />
  );
};

export default SpanTreeView;
