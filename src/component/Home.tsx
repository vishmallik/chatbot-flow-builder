import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  MarkerType,
  Node,
  OnConnect,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
  useOnSelectionChange,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import TextNode from "./TextNode";
import SideBar from "./SideBar";
import Settings from "./Settings";
import TopBar from "./TopBar";

//Defining custom node type TextNode component
const nodeTypes = { textNode: TextNode };

// We will check if localStorage has some saved nodes or not. If present then we will find the highest node Id used and increment it by one.
// Otherwise Id will start from 2, since one Node is intial added
let id: number =
  JSON.parse(localStorage.getItem("reactFlowData")!)?.nodes.reduce(
    (acc: number, cv: Node) => {
      if (parseInt(cv.id) >= acc) {
        acc = parseInt(cv.id);
      }
      return acc;
    },
    0
  ) + 1 || 2;

const getId = () => `${id++}`;

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Send Message", message: `Text Message 1` },
    type: "textNode",
  },
];

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeMessage, setNodeMessage] = useState("");
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saveMessage, setSaveMessage] = useState<{
    status: string;
    message: string;
  } | null>(null);

  const { setViewport } = useReactFlow();

  //This function defines what to do when edges join, here we are also adding markerEnd type as closed Arrow.
  const onConnect: OnConnect = useCallback(
    (params) => {
      return setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // onDragOver Handler to define dropEffect when dragging ends
  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  //onDrop Handler to do stuff when message block is dropped on the viewport
  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      //get position of the dropped element
      const position = reactFlowInstance!.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      //create new node with these parameters
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `Send Message`, message: `textNode` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  //Function for saving the data to localStorage when Save changes button is pressed
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();

      // Array of Node ids
      const nodesArr: string[] = flow.nodes.map((node) => node.id);

      //Set Data Structure to store unique node id which are via an edge
      const edgesSet = new Set();

      flow.edges.forEach((edge) => {
        if (!edgesSet.has(edge.source)) {
          edgesSet.add(edge.source);
        }
        if (!edgesSet.has(edge.target)) {
          edgesSet.add(edge.target);
        }
      });

      //Boolean value to check if every node is connect to one another or not
      const isValid = nodesArr.every((nodeId) => {
        return edgesSet.has(nodeId);
      });

      if (isValid) {
        //If Condition is valuid then store JSON to localStorage and show success message
        localStorage.setItem("reactFlowData", JSON.stringify(flow));
        setSaveMessage({
          status: "success",
          message: "Saved flow sucessfully!",
        });
      } else {
        //If condition is invalid then show failure message
        setSaveMessage({ status: "failure", message: "Cannot save flow!" });
      }
    }
  }, [reactFlowInstance]);

  const onRestore = () => {
    //Get Flow data from localStorage
    const flow = JSON.parse(localStorage.getItem("reactFlowData")!);

    //Update Nodes, Edges and Viewport from the flow data
    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
    }
  };

  //ReactFlow hook for selection change. Also only last selected Node is used
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNode(nodes[nodes.length - 1]);
    },
  });

  //On selecting a Node, update the nodeMessage state with data from selected Node
  useEffect(() => {
    if (selectedNode) {
      setNodeMessage(selectedNode.data.message);
    }
  }, [selectedNode]);

  // When node Message is updated from Settings component, Exiting nodes need to be updated to reflect changes.
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode?.id) {
          node.data = {
            ...node.data,
            message: nodeMessage,
          };
        }

        return node;
      })
    );
  }, [nodeMessage, setNodes, selectedNode]);

  //On Component mount, load data from localStorage
  useEffect(() => {
    onRestore();
  }, []);

  return (
    <>
      {/* TopBar component contains the top ribbon with Save changes button */}
      <TopBar onSave={onSave} message={saveMessage} />
      <main className="flex justify-between items-center flex-1 h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Controls />
        </ReactFlow>
        {/* If a node is selected then show Settings Component, otherwise SideBar Component */}
        {selectedNode ? (
          <Settings
            nodeMessage={nodeMessage}
            setNodeMessage={setNodeMessage}
            setSelectedNode={setSelectedNode}
          />
        ) : (
          <SideBar />
        )}
      </main>
    </>
  );
}
