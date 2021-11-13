export const reactTemplate = {
	'public/index.html': `<html>
 <head>
 </head>
 <body>
    <div id="root"></div>
  </body>    
</html>`,

	'src/index.js': `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App.jsx";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    rootElement
);`,

	'src/App.jsx': `import React from 'react';
import "./styles.css";

export default function App() {
    return (
    <div className="App">
        <h1>&#127757; Hello, world!</h1>
    </div>
    );
}`,

	'src/styles.css': `.App {
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
`,

	'package.json': `{
    "main": "src/index.js"
}`
};
