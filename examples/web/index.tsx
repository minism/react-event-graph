import { createRoot } from "react-dom/client";
import Home from "./app/page";

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Home />);
