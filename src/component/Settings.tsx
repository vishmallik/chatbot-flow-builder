import { Dispatch, SetStateAction, memo } from "react";
import { Node } from "reactflow";

type SettingsProps = {
  nodeMessage: string;
  setNodeMessage: Dispatch<SetStateAction<string>>;
  setSelectedNode: Dispatch<SetStateAction<Node | null>>;
};

function Settings({
  nodeMessage,
  setNodeMessage,
  setSelectedNode,
}: SettingsProps) {
  return (
    <aside className="border border-solid border-gray-400 h-full w-80">
      <div className="flex items-center border-b border-b-solid border-b-gray-400 p-5">
        {/* On clicking back button, update selection to null */}
        <button type="button" onClick={() => setSelectedNode(null)}>
          <img
            src="/images/arrow.png"
            alt="back"
            className="w-4 cursor-pointer"
          />
        </button>

        <p className="flex-1 text-center">Message</p>
      </div>

      <div className="p-5 border-b border-b-solid border-b-gray-400">
        <label htmlFor="message">Text</label>
        {/* Text Area to display content of the textNode, change this to update the contents of textNode */}
        <textarea
          id="message"
          rows={4}
          className="w-full border border-solid border-gray-400 my-4 p-2"
          value={nodeMessage}
          onChange={({ target }) => setNodeMessage(target.value)}
        />
      </div>
    </aside>
  );
}
export default memo(Settings);
