export default function Message({ type, text }) {

  const styles = {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    fontWeight: "bold"
  };

  const typeStyles = {
    success: { backgroundColor: "#d4edda", color: "#155724" },
    error: { backgroundColor: "#f8d7da", color: "#721c24" }
  };

  return (
    <div style={{ ...styles, ...typeStyles[type] }}>
      {text}
    </div>
  );
}