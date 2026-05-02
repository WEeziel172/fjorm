import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { Config, FormBuilder, formComponents } from 'fjorm';
import 'fjorm/dist/index.css';
export default function App() {
    const config = new Config();
    config.addComponents(formComponents);
    const builderRef = useRef(null);
    return (_jsxs("div", { className: "demo-wrapper", children: [_jsxs("header", { className: "demo-header", children: [_jsx("h1", { children: "fjorm" }), _jsx("span", { className: "demo-badge", children: "React Form Builder" })] }), _jsx("div", { className: "demo-builder", children: _jsx(FormBuilder, { ref: builderRef, config: config, onSubmit: (data) => {
                        alert('Form submitted:\n' + JSON.stringify(data, null, 2));
                    }, onChange: (structure) => {
                        console.log('Form structure:', structure);
                    } }) })] }));
}
