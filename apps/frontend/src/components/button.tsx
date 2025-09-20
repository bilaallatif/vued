export const BasicButton = ({
  onClick,
  text,
}: {
  onClick?: () => void;
  text: string;
}) => (
  <button
    className={
      "text-neutral-900 text-2xl bg-yellow-600 p-2 rounded-md hover:bg-yellow-500 hover:scale-110 transition-transform duration-200"
    }
    onClick={onClick}
  >
    {text}
  </button>
);
