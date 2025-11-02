import { Button, type ButtonProps } from "flowbite-react";

interface AccentButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

function AccentButton({ children, className = "", ...props }: AccentButtonProps) {
  return (
    <Button
      {...props}
      type={props.type ?? "submit"}
      className={`bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-primary hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800 ${className}`}
    >
      {children}
    </Button>
  );
}

export default AccentButton;
