import "./Card.css";

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div className="card">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
