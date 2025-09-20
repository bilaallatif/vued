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
    <label className={"text-2xl text-neutral-400 flex flex-col gap-2"}>
      {name}
      <input
        className={
          "block bg-neutral-100/5 rounded-md focus:outline-2 focus:outline-yellow-600 px-2"
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
    <label className={"text-2xl text-neutral-400 flex flex-col gap-2"}>
      {name}
      <textarea
        className={
          "block bg-neutral-100/5 rounded-md focus:outline-2 focus:outline-yellow-600 px-2"
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
};
