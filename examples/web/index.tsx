import { createRoot } from "react-dom/client";
import Home from "./app/page";

import { provider } from "./module/tracerProvider";

console.log(provider);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Home />);
