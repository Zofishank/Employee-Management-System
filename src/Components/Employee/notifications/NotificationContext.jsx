import { useNotification } from "../Components/Employee/notifications/Notifications";

const MyComponent = () => {
  const { showNotification } = useNotification();

  return (
    <button onClick={() => showNotification("Hello World!", "success")}>
      Click Me
    </button>
  );
};

export default MyComponent;