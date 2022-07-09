import { Switch } from "antd";
import { useState } from "react";
import { ClientProps } from "./App";
import Aria2Client from "./Aria2Client";
import "./Servers.css";
interface ServerProps {
  client: Aria2Client;
  setClient: any;
  success: boolean;
  setSuccess: any;
}
export default function Servers({
  client,
  setClient,
  success,
  setSuccess,
}: ServerProps) {
  // console.log(client.port, client.ip, client.secret);

  let servers = JSON.parse(localStorage.getItem("aria2-servers") ?? "[]");
  // console.log(servers);
  function matchServer(ip: string, port: string, secret: string) {
    return (
      ip === client.ip &&
      port === client.port &&
      secret === client.secret &&
      success
    );
  }
  function handleChangeServer(server: any) {
    let client = new Aria2Client(server.ip, server.port, server.secret);
    client.ready().then(
      (r) => {
        setSuccess(true);
      },
      (e) => {
        setSuccess(false);
      }
    );
    setClient(client);
  }
  return (
    <div className="ServersContainer">
      {servers.map((server: any) => {
        return (
          <div className="Card">
            <div className="text">ip: {server.ip}</div>
            <div className="text">port: {server.port}</div>
            <div className="text">secret: {server.secret}</div>
            {
              <Switch
                checked={matchServer(server.ip, server.port, server.secret)}
                onChange={() => {
                  handleChangeServer(server);
                }}
              />
            }
          </div>
        );
      })}
    </div>
  );
}
