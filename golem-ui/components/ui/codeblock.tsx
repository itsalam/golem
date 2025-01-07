import { FC } from "react";


import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';

export const Code: FC<{code:string}> = ({ code }) => {
    // const [value, setValue] = useState(code);

    // // const onChange = useCallback((val, viewUpdate) => {
    // //   console.log('val:', val);
    // //   setValue(val);
    // // }, []);

    return <CodeMirror value={code} height="200px" extensions={[json()]} editable={false} />;
  };
  