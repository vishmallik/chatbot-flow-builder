export default function SideBar() {
  // on Drag start function to define what to do when drag event starts
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside className="border border-solid border-gray-400 h-full p-6 w-96">
      <ul className="py-4 grid grid-cols-2 gap-4">
        {/* Message Component */}
        <li
          className="cursor-grab py-4 px-8 border-2 border-solid border-indigo-500 rounded-md inline-flex items-center justify-between flex-col text-indigo-500"
          onDragStart={(event) => onDragStart(event, "textNode")}
          draggable
        >
          <img
            src="/images/messenger.png"
            alt="message"
            className="w-5 msgIcon"
            draggable={false}
          />
          Message
        </li>

        {/* Other Nodes can be added here */}
      </ul>
    </aside>
  );
}
