import React, { useEffect, useMemo, useState } from "react";
import Aria2Client from "./Aria2Client";
import "./App.css";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import AddTask from "./AddTask";
import Downloading from "./Downloading";
import Done from "./Done";
import Waiting from "./Waiting";
import AddServer from "./AddServer";
import Servers from "./Servers";
import { message } from "antd";
//@ts-ignore
globalThis.Aria2Client = Aria2Client;
export interface ClientProps {
  client: Aria2Client;
}
export interface ServerProps {
  setAria2Client: any;
  setSuccess: any;
}
function App() {
  const [client, setClient] = useState(
    useMemo(() => {
      let aria = new Aria2Client("127.0.0.1", "10000", "111222333", true);
      return aria;
    }, [])
  );

  // const client = ;

  const [success, setSuccess] = useState(false);
  useEffect(() => {
    client.on("DownloadStart", () => {
      message.info("下载开始了");
    });
    client.on("DownloadComplete", () => {
      message.success("下载完成了");
    });
  }, [client]);
  // console.log(client);
  // if (client) {
  //   console.log("client ok");
  // }

  // interface globalStatI {
  //   numActive: string;
  // }

  const [globalStat, setGlobalStat] = useState<any>();

  //@ts-ignore
  globalThis.client = client;
  if (success) {
    //@ts-ignore
    client.getGlobalStat().then((r) => {
      setGlobalStat(r);
      // console.log(globalStat!.numActive, "numActive");
    });
  }

  return (
    <div className="App">
      <div className="left-side">
        <NavLink to="/AddServer">
          <button>添加服务器</button>
        </NavLink>
        <div className="menu-container">
          <NavLink to="/AddTask">
            <div className="menu-icon-container">
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              <span className="text">新建</span>
            </div>
          </NavLink>

          <NavLink to="Downloading/">
            <div className="menu-icon-container">
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                  />
                </svg>
              </div>
              <span className="text">正在下载</span>
              <span>{globalStat ? globalStat.numActive : ""}</span>
            </div>
          </NavLink>
          <NavLink to="/Waiting">
            <div className="menu-icon-container">
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text">正在等待</span>
              <span>{globalStat ? globalStat.numWaiting : ""}</span>
            </div>
          </NavLink>
          <NavLink to="/Done">
            <div className="menu-icon-container">
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text">已完成/已移除</span>
              <span>{globalStat ? globalStat.numStopped : ""}</span>
            </div>
          </NavLink>
          <NavLink to="/Servers">
            <div className="menu-icon-container">
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
              </div>
              <span className="text">服务器列表</span>
            </div>
          </NavLink>
        </div>
      </div>
      <div className="right-side">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/addServer" replace />}
          ></Route>
          <Route
            path="/AddServer"
            element={
              <AddServer setAria2Client={setClient} setSuccess={setSuccess} />
            }
          ></Route>
          <Route path="/AddTask" element={<AddTask client={client} />}></Route>
          <Route
            path="/Downloading"
            element={<Downloading client={client} />}
          ></Route>
          <Route path="/Waiting" element={<Waiting client={client} />}></Route>
          <Route path="/Done" element={<Done client={client} />}></Route>
          <Route
            path="/Servers"
            element={
              <Servers
                client={client}
                setClient={setClient}
                success={success}
                setSuccess={setSuccess}
              />
            }
          ></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
