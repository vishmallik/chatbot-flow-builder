import { useMemo } from "react";
import {
  Edge,
  getConnectedEdges,
  Handle,
  HandleProps,
  Node,
  ReactFlowState,
  useNodeId,
  useStore,
} from "reactflow";

type CustomIsConnectable =
  | boolean
  | ((params: { node: Node; connectedEdges: Edge[] }) => boolean)
  | number;

interface CustomHandleProps extends Omit<HandleProps, "isConnectable"> {
  isConnectable?: CustomIsConnectable;
}

const selector = (s: ReactFlowState) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

//Custom Handle Component where isConnectable prop can be number, boolean or a function returning boolean value
const CustomHandle = (props: CustomHandleProps) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId() as string;

  const isHandleConnectable = useMemo(() => {
    if (typeof props.isConnectable === "function") {
      const node = nodeInternals.get(nodeId) as Node;
      const connectedEdges = getConnectedEdges([node], edges);

      return props.isConnectable({ node, connectedEdges });
    }

    if (typeof props.isConnectable === "number") {
      const node = nodeInternals.get(nodeId) as Node;
      const connectedEdges = getConnectedEdges([node], edges);

      return connectedEdges.length < props.isConnectable;
    }

    return props.isConnectable;
  }, [nodeInternals, edges, nodeId, props.isConnectable]);

  return <Handle {...props} isConnectable={isHandleConnectable} />;
};

export default CustomHandle;
