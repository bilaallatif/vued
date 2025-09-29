// Rare use of Material UI
import Rating from "@mui/material/Rating";

export interface FormInputProps {
  type?: string;
  name: string;
  value: string;
  setValue: (value: string) => void;
}

export const FormInput = ({
  type = "text",
  name,
  value,
  setValue,
}: FormInputProps) => {
  return (
    <label className={"text-2xl text-neutral-400 flex flex-col gap-2 w-full"}>
      {name}
      <input
        className={
          " bg-neutral-100/5 rounded-md focus:outline-2 focus:outline-yellow-600 px-2"
        }
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
};

export const FormTextArea = ({ name, value, setValue }: FormInputProps) => {
  return (
    <label
      className={"text-2xl h-full text-neutral-400 flex flex-col gap-2 w-full"}
    >
      {name}
      <textarea
        className={
          "block bg-neutral-100/5 rounded-md focus:outline-2 focus:outline-yellow-600 px-2 h-full"
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
};

export const FormRating = ({ name }: { name: string }) => {
  return (
    <label
      className={
        "text-2xl text-neutral-400 flex flex-row items-center gap-10 w-full"
      }
    >
      {name}
      <div
        className={
          "flex items-center justify-center bg-neutral-100/5 rounded-md p-2"
        }
      >
        <Rating name={"rating"} defaultValue={0} precision={0.5} size="large" />
      </div>
    </label>
  );
};

export const FormSearch = ({
  name,
  searchStr,
  onSearch,
  data,
}: {
  name: string;
  searchStr: string;
  onSearch: (val: string) => void;
  data: { title: string; id: number }[];
}) => {
  return (
    <label className={"text-2xl text-neutral-400 flex flex-col gap-2 w-full"}>
      {name}
      <div className={"relative"}>
        <input
          className={
            "block bg-neutral-100/5 rounded-md focus:outline-2 focus:outline-yellow-600 px-2 w-full"
          }
          value={searchStr}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div
          className={
            "flex flex-col bg-neutral-700 gap-2 rounded-md top-12/10 absolute w-full"
          }
        >
          {data.map((movie) => (
            <button
              className={"text-left hover:bg-neutral-100/5 w-full"}
              key={movie.id}
            >
              <div className={"px-2"}> {movie.title}</div>
            </button>
          ))}
        </div>
      </div>
    </label>
  );
};
