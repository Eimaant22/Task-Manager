import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim() && !todoList.includes(option.trim())) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={index}   
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>
          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
  <input
    type="text"
    placeholder="Enter Task"
    value={option}
    onChange={({ target }) => setOption(target.value)}
    className="flex-1 text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
  />
  <button
    className="ml-3 flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    onClick={handleAddOption}
  >
    <HiMiniPlus className="text-lg" /> Add
  </button>
</div>

    </div>
  );
};

export default TodoListInput;
