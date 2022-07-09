import m from "./ice-mountain.jpg";
import "./AddServer.css";
import { useInput } from "./hooks";
import Aria2Client from "./Aria2Client";
import { ServerProps } from "./App";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
export default function AddServer({ setAria2Client, setSuccess }: ServerProps) {
  const { value: ip, onChange: setIp, clear: clear1 } = useInput("");
  const { value: port, onChange: setPort, clear: clear2 } = useInput("");
  const { value: secret, onChange: setSecret, clear: clear3 } = useInput("");
  const navigate = useNavigate();

  function hasServer(serevrs: any[]) {
    for (let server of serevrs) {
      if (ip === server.ip && port === server.port && secret === server.secret)
        return true;
    }
    return false;
  }
  function handleSubmitServer() {
    console.log(ip, port, secret);
    clear1();
    clear2();
    clear3();
    let client = new Aria2Client(ip, port, secret);
    //在localStorage中存储servers的信息
    let servers: any[];
    servers = JSON.parse(localStorage.getItem("aria2-servers") ?? "[]");
    if (hasServer(servers)) {
    } else {
      servers!.push({ ip, port, secret });
    }
    console.log(servers);
    localStorage.setItem("aria2-servers", JSON.stringify(servers));
    setAria2Client(client);
    client.ready().then(
      (r) => {
        setSuccess(true);
        navigate("/addTask");
      },
      (e) => {
        navigate("/Servers");
      }
    );
  }
  return (
    <div className="AddServerContainer">
      <div className="Card">
        <img src={m} alt="img" className="leftImg"></img>
        <div className="ServerInfo">
          <div className="container">
            <div className="desc">在此输入服务器信息</div>
            <div className="iconbox">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                value={ip}
                onChange={setIp}
                placeholder="服务器ip地址"
              ></input>
            </div>
            <div className="iconbox">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                value={port}
                onChange={setPort}
                placeholder="端口号"
              ></input>
            </div>
            <div className="iconbox">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" />
                <path
                  fillRule="evenodd"
                  d="M8 10a4 4 0 00-3.446 6.032l-1.261 1.26a1 1 0 101.414 1.415l1.261-1.261A4 4 0 108 10zm-2 4a2 2 0 114 0 2 2 0 01-4 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                placeholder="秘钥"
                value={secret}
                onChange={setSecret}
              ></input>
            </div>
          </div>
          <button onClick={handleSubmitServer}>连接</button>
        </div>
      </div>
    </div>
  );
}
