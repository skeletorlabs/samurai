import { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import classNames from "classnames";

interface SSSelectProps {
  options: string[];
  onChange: (value: string) => void;
  value: string;
}

export default function SSSelect({ options, onChange, value }: SSSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <div
      className={classNames({
        "w-46 2xl:w-52 font-medium relative": true,
        "z-50": open,
        "z-0": !open,
      })}
    >
      <div
        className="w-full p-2 px-4 flex items-center justify-between border border-white/20 rounded-full cursor-pointer relative"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs lg:text-sm">{selected}</span>
        <BiChevronDown
          size={20}
          className={classNames({ "rotate-180": open })}
        />
      </div>
      <ul
        className={classNames({
          "absolute top-9 left-0 w-40 lg:w-52 bg-black/50 backdrop-blur-md rounded-lg mt-2 overflow-y-auto":
            true,
          "max-h-0": !open,
          "max-h-60": open,
        })}
      >
        {options.map((option, index) => (
          <li
            key={index}
            className={classNames({
              "p-4 text-xs lg:text-sm cursor-pointer": true,
              "bg-black text-samurai-red": option === selected,
              "hover:bg-black/30": option !== selected,
            })}
            onClick={() => {
              setSelected(option);
              onChange(option);
              setOpen(false);
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
