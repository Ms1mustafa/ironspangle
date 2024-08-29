export default function Button({ children, className, ...props }) {
  return (
    <button
      disabled={props.disabled}
      className={`button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
