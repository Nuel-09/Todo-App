import "./Button.css";

interface ButtonProps {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const Button = ({ text, type = "button", onClick }: ButtonProps) => {
  return (
    <button className="btn-primary" type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
