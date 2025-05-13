// Format date objects into a readable time string for message timestamps.
const formatMessageTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: "false",
  });
};

export default formatMessageTime;
