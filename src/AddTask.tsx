import { ClientProps } from "./App";
import "./AddTask.css";
import TextArea from "antd/lib/input/TextArea";
import { useInput } from "./hooks";
import { useNavigate } from "react-router-dom";

export default function AddTask({ client }: ClientProps) {
  const { value, onChange, clear } = useInput("");
  let navigate = useNavigate();
  function startDownload() {
    let links = value
      .split("\n")
      .map((it: any) => it.trim())
      .filter((it: any) => it);
    clear();

    for (let link of links) {
      //@ts-ignore
      client.addUri([link]);
    }

    navigate("/Downloading");
    console.log(links);
  }
  return (
    <div className="AddTaskContainer">
      <div className="Card">
        <TextArea
          value={value}
          onChange={onChange}
          size="large"
          rows={20}
          cols={70}
          style={{ fontSize: "1.5em" }}
          placeholder="在此处添加下载链接，可以添加多个，一行一个"
        />
      </div>
      <button
        onClick={() => {
          startDownload();
        }}
      >
        开始下载
      </button>
    </div>
  );
}
