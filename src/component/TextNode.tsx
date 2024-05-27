import { Node, Position } from "reactflow";
import CustomHandle from "./CustomHandle";
import { memo } from "react";

//This component is a Custom Node, it defines how a node will looks and behave
const TextNode = ({ data }: { data: Node["data"] }) => {
  return (
    <>
      <div className="rounded-md shadow-xl min-w-72">
        <div className="bg-teal-300 px-4 py-1 rounded-t-md flex justify-between items-center">
          <div className="flex justify-between items-center space-x-2">
            <img src="/images/messenger.png" alt="message" className="w-4" />
            <p className="font-bold">{data.label}</p>
          </div>
          <div>
            <img
              src="/images/whatsapp.png"
              alt="whatsapp_logo"
              className="w-4"
            />
          </div>
        </div>
        <div className="p-4">{data.message}</div>
      </div>
      {/* Instead of using Handle Component of ReactFlow, a wrapper for Handle Component is used since isConnectable prop in Handle Component is boolean or undefined, but we need to defined that source Handle can have single connection while target Handle can have multiple connection. So need to define this CustomHandleWrapper to handle that scenario */}
      <CustomHandle type="source" position={Position.Right} isConnectable={1} />
      <CustomHandle type="target" position={Position.Left} isConnectable />
    </>
  );
};
export default memo(TextNode);
