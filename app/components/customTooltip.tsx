import { Tooltip } from "flowbite-react";

interface CustomTooltip {
  children: React.ReactNode;
  disabled: boolean;
  dark: boolean;
}

const info = (
  <svg
    data-slot="icon"
    fill="none"
    strokeWidth="1"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    ></path>
  </svg>
);

export default function CustomTooltip({
  children,
  disabled,
  dark,
}: CustomTooltip) {
  return disabled ? (
    <div className="hidden sm:block w-5 h-5 text-white/10">{info}</div>
  ) : (
    <Tooltip style="dark" content={children}>
      <div className={`w-5 h-5 ${dark ? "text-black" : "text-white/50"}`}>
        {info}
      </div>
    </Tooltip>
  );
}
